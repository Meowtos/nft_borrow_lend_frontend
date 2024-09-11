"use client";
import React, { useState } from "react";
import { useApp } from "@/context/AppProvider";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { Token } from "@/types/Token";
import { toast } from "sonner";
import { useFormik } from "formik";
import Image from 'next/image'
import { IoIosArrowDown } from 'react-icons/io'
import { IoClose } from 'react-icons/io5'

export const assetListingModalId = "assetListingModal";
interface ListingModalProps {
    token: Token | null
}
export function ListingModal({ token }: ListingModalProps) {
    const { assets } = useApp();
    const { account } = useWallet();
    const { values, handleSubmit, handleChange } = useFormik({
        initialValues: {
            fa_metadata: "",
            amount: "",
            duration: "",
            apr: ""
        },
        onSubmit: async (data) => {
            if (!account?.address || !token) return;
            const formData = {
                ...data,
                account_address: account.address,
                collection_id: token.collection_id,
                token_data_id: token.token_data_id,
                token_icon: token.token_icon_uri,
                token_name: token.token_name,
                fa_metadata: data.fa_metadata !== "" ? data.fa_metadata : null,
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
        }
    })
    const [dropdownToken, setDropdownToken] = useState(true);
    const [dropdownDuration, setDropdownDuration] = useState(true);
    const [chosenToken, setChosenToken] = useState<Token | null>(null);

    const handleTokenSelection = (fa: Token) => {
        setChosenToken(fa)
        setDropdownToken(!dropdownToken);
    };
    const handleDurationSelection = () => {
        setDropdownDuration(!dropdownDuration);
    };
    return (
        <React.Fragment>
            <div className="modal fade" id={assetListingModalId} tabIndex={-1} aria-labelledby={`${assetListingModalId}Label`} >
                <div className="modal-dialog modal-dialog-centered modal-xl">
                    <div className="modal-content list-modal">
                        <IoClose type="button" className="text-light close-icon" data-bs-dismiss="modal" aria-label="Close" />
                        <div className="row">
                            <div className="col-lg-4 p-0">
                                <Image src={`/media/nfts/1.jpeg`} className="w-100" alt="..." width={250} height={370} />
                                {/* <h5 className="mt-3">legend1002</h5>
                                <p className="mt-3">Legends Trade</p> */}
                            </div>
                            <div className="col-lg-8 p-0 ps-5">
                                <h3>Asset Listing</h3>
                                {
                                    token &&
                                    <form className="asset-form pt-4" onSubmit={handleSubmit} autoComplete="off">
                                        <div className="form-group">
                                            <div className="dropdown-btn select-field">
                                                <button className="rounded text-start w-100" onClick={() => setDropdownToken(!dropdownToken)}>
                                                    {
                                                        chosenToken ? chosenToken.symbol : "Select Token"
                                                    }
                                                    <IoIosArrowDown className="dd-icon" /></button>
                                            </div>
                                            <div className="coll-dropdown rounded select-dropdown" hidden={dropdownToken}>
                                                {
                                                    assets.map(fa => (
                                                        <div className="coll-item" onClick={() => handleTokenSelection(fa)}>
                                                            <p key={fa.asset_type}>{fa.symbol}</p>
                                                        </div>
                                                    ))}
                                            </div>
                                        </div>
                                        {/* <label>Select token</label>
                                        <select className="form-select" name="fa_metadata" value={values.fa_metadata} onChange={handleChange}>
                                            <option value=""></option>
                                            {
                                                assets.map(fa => (
                                                    <option value={fa.asset_type} key={fa.asset_type}>{fa.symbol}</option>
                                                ))
                                            }
                                        </select> */}
                                        <input type="text" name="amount" value={values.amount} onChange={handleChange} placeholder="Enter Amount" className="form-control" />
                                        <div className="form-group">
                                            <div className="dropdown-btn select-field">
                                                <button className="rounded text-start w-100" onClick={() => setDropdownDuration(!dropdownDuration)}>Select lock duration<IoIosArrowDown className="dd-icon" /></button>
                                            </div>
                                            <div className="coll-dropdown rounded select-dropdown" hidden={dropdownDuration}>
                                                <div className="coll-item" onClick={()=>handleDurationSelection}><p>1 days</p></div>
                                                <div className="coll-item" onClick={()=>handleDurationSelection}><p>2 days</p></div>
                                                <div className="coll-item" onClick={()=>handleDurationSelection}><p>3 days</p></div>
                                                <div className="coll-item" onClick={()=>handleDurationSelection}><p>4 days</p></div>
                                                <div className="coll-item" onClick={()=>handleDurationSelection}><p>5 days</p></div>
                                            </div>
                                        </div>
                                        {/* <label>Select lock duration</label>
                                        <select name="duration" value={values.duration} onChange={handleChange} className="form-control">
                                            <option value="1">1 days</option>
                                            <option value="2">2 days</option>
                                        </select> */}
                                        <input type="text" name="apr" value={values.apr} onChange={handleChange} className="form-control" placeholder="APR(%)" />
                                        <input type="submit" className="submit-btn" />
                                    </form>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}