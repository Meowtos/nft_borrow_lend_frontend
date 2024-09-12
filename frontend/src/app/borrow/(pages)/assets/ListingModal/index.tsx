"use client";
import React, { useMemo, useState } from "react";
import { useApp } from "@/context/AppProvider";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { Token } from "@/types/Token";
import { toast } from "sonner";
import { useFormik } from "formik";
import Image from 'next/image'
import { IoIosArrowDown } from 'react-icons/io'
import { IoClose } from 'react-icons/io5'
import { IoMdGlobe } from "react-icons/io";
import { RiTwitterXLine } from "react-icons/ri";
import { MdCollections } from "react-icons/md";
import { MdOutlineToken } from "react-icons/md";

import { MAX_LOCK_DURATION } from "@/utils/aptos";

export const assetListingModalId = "assetListingModal";
interface ListingModalProps {
    token: Token | null
}
export function ListingModal({ token }: ListingModalProps) {
    const { assets } = useApp();
    const { account } = useWallet();
    const [dropdownToken, setDropdownToken] = useState(true);
    const [submitLoading, setSubmitLoading] = useState(false);
    const { values, handleSubmit, handleChange, setFieldValue } = useFormik({
        initialValues: {
            coin: "",
            amount: "",
            duration: "",
            apr: ""
        },
        onSubmit: async (data) => {
            if (!account?.address || !token) return;
            setSubmitLoading(true)
            const formData = {
                ...data,
                account_address: account.address,
                collection_id: token.collection_id,
                token_data_id: token.token_data_id,
                token_icon: token.token_icon_uri,
                token_name: token.token_name,
                fa_metadata: data.coin !== "" ? data.coin : null,
            }
            fetch("/api/listing", {
                method: "POST", headers: {
                    contentType: "application/json"
                }, body: JSON.stringify(formData)
            }).then((res) => {
                if (!res.ok) {
                    return res.json().then((error) => {
                        throw new Error(error.message)
                    })
                }
                return res.json()
            }).then(() => {
                document.getElementById("closeAssetListingModal")?.click()
                toast.success("Item listed")
            }).catch((error) => {
                toast.error(error.message)
            })
            setSubmitLoading(false)
        }
    })
    const chosenCoin = useMemo(() => {
        if (values.coin && values.coin !== "") {
            return assets.find((asset) => asset.asset_type === values.coin);
        }
    }, [assets, values.coin])
    return (
        <React.Fragment>
            <div className="modal fade" id={assetListingModalId} tabIndex={-1} aria-labelledby={`${assetListingModalId}Label`} >
                <div className="modal-dialog modal-dialog-centered modal-xl">
                    <div className="modal-content list-modal">
                        <IoClose type="button" className="text-light close-icon" data-bs-dismiss="modal" aria-label="Close" />
                        {
                            token &&
                            <div className="row">
                                <div className="col-lg-3 p-0">
                                    <div className="asset-socials text-start">
                                        <RiTwitterXLine className="token-sc-icon me-2"/>
                                        <IoMdGlobe className="token-sc-icon"/>
                                    </div>
                                    <div className="nft">
                                        <Image src={token.token_icon_uri ?? ""} className="asset-img" alt={token.token_name} width={150} height={200} />
                                        {/* <Image src={`/media/nfts/1.jpeg`} className="asset-img" alt={token.token_name} width={150} height={200} /> */}
                                    </div>
                                    <div className="nft-details">
                                        <h4 className="text-center">{token.token_name}</h4>
                                        <p><MdCollections className="text-light"/> {token.collection_name}</p>
                                        <p><MdOutlineToken className="text-light"/>{token.token_standard}</p>
                                        <p className="desc">{token.token_description}</p>
                                    </div>

                                </div>
                                <div className="col-lg-9 p-0 ps-5">
                                    <h3>Asset Listing</h3>
                                    <form className="asset-form pt-4" onSubmit={handleSubmit} autoComplete="off">
                                        <div className="form-group">
                                            <div className="dropdown-btn select-field">
                                                <button type="button" className="rounded text-start w-100" onClick={() => setDropdownToken(!dropdownToken)}>
                                                    {
                                                        chosenCoin ? chosenCoin.symbol : "Any"
                                                    }
                                                    <IoIosArrowDown className="dd-icon" /></button>
                                            </div>
                                            <div className="coll-dropdown rounded select-dropdown" hidden={dropdownToken}>
                                                {
                                                    assets.map(fa => (
                                                        <div className="coll-item" onClick={() => {
                                                            setFieldValue("coin", fa.asset_type);
                                                            setDropdownToken(!dropdownToken)
                                                        }} key={fa.asset_type}>
                                                            <p>
                                                                <Image src={fa.icon_uri} alt={fa.symbol} height={20} width={20} className="rounded-circle me-2" />
                                                                {fa.symbol} ({fa.token_standard})</p>
                                                        </div>
                                                    ))}
                                            </div>
                                        </div>
                                        <input type="text" name="amount" value={values.amount} onChange={handleChange} placeholder="Enter Amount" className="form-control" />
                                        <input type="text" name="duration" value={values.duration} onChange={handleChange} placeholder="Enter Duration (In days)" className="form-control" />
                                        <input type="text" name="apr" value={values.apr} onChange={handleChange} className="form-control" placeholder="Enter APR (%)" />
                                        {
                                            submitLoading
                                                ?
                                                <button type="button" disabled className="submit-btn">
                                                    Loading...
                                                </button>
                                                :
                                                <input type="submit" className="submit-btn" />
                                        }
                                    </form>
                                    <p className="mt-4 notice"><strong>Notice:</strong> By selecting this NFT as collateral, you acknowledge that the NFT will be securely transferred and stored with us for the duration of the loan. You will not have access to this NFT until the loan is fully repaid.</p>
                                </div>
                            </div>
                        }
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}