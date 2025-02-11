"use client";
import React, { useMemo, useState } from "react";
import { useApp } from "@/context/AppProvider";
import { toast } from "sonner";
import { useFormik } from "formik";
import Image from 'next/image'
import { IoIosArrowDown } from 'react-icons/io'
import { IoClose } from 'react-icons/io5'
import { MdCollections } from "react-icons/md";
import { MdOutlineToken } from "react-icons/md";
import * as Yup from "yup";
import { ButtonLoading } from "@/components/ButtonLoading";
import { Collection, Token } from "../Body";
import { getChainOperatingTokens } from "@/utils/chain";
export const assetListingModalId = "assetListingModal";
interface ListingModalProps {
    token: Token | null;
    collection: Collection | null;
}
export function ListingModal({ token, collection }: ListingModalProps) {
    const { chain } = useApp();
    const [dropdownToken, setDropdownToken] = useState(true);
    const [submitLoading, setSubmitLoading] = useState(false);
    const { values, handleSubmit, handleChange, setFieldValue, errors, touched } = useFormik({
        initialValues: {
            token_address: "",
            amount: "",
            duration: "",
            apr: ""
        },
        validationSchema: Yup.object({
            amount: Yup.number().typeError("Amount must be a number").positive("Amount must be +ve"),
            duration: Yup.number().min(1, "Minimum 1 day required"),
            apr: Yup.number().positive("Apr must be +ve"),
        }),
        onSubmit: async (data) => {
            // if ((!account?.address && !activeAccount?.accountAddress) || !token) return;

            // setSubmitLoading(true)
            // try {
            //     const account_address = activeAccount ? activeAccount.accountAddress?.toString() : account?.address
            //     const formData = {
            //         ...data,
            //         address: account_address,
            //         collection_id: token.collection_id,
            //         collection_name: token.collection_name,
            //         token_data_id: token.token_data_id,
            //         token_icon: token.token_icon_uri,
            //         token_name: token.token_name,
            //         token_standard: token.token_standard,
            //         coin: data.coin !== "" ? data.coin : null,
            //     }
            //     const res = await fetch("/api/listing", {
            //         method: "POST",
            //         headers: {
            //             contentType: "application/json"
            //         },
            //         body: JSON.stringify(formData)
            //     });
            //     const response = await res.json();
            //     if (!res.ok) {
            //         throw new Error(response.message)
            //     }
            //     document.getElementById("closeAssetListingModal")?.click();
            //     toast.success("Item listed successfully")
            //     await getUserListings()
            //     /// 
            //     // Discord embed to discord server 
            //     ///
            //     await fetch(`/api/discord-bot/send-listing-embed`, {
            //         method: "POST",
            //         headers: {
            //             "Content-Type": "application/json"
            //         },
            //         body: JSON.stringify({
            //             recepient_id: LISTING_CHANNEL_ID,
            //             title: `${token.token_name}`,
            //             image: token.token_icon_uri,
            //             url: `${window.location.origin}/lend/assets`,
            //             amount: data.amount != "" ? data.amount : null,
            //             coin: data.coin ? getAssetByType(data.coin)?.symbol : null,
            //             apr: data.apr !== "" ? data.apr : null,
            //             duration: data.duration !== "" ? data.duration : null
            //         })
            //     });
            //     await fetch("/api/telegram/send-photo", {
            //         method: "POST",
            //         headers: {
            //             "Content-Type": "application/json"
            //         },
            //         body: JSON.stringify({
            //             title: `${token.token_name}`,
            //             image: token.token_icon_uri,
            //             url: `${window.location.origin}/lend/assets`,
            //             amount: data.amount != "" ? data.amount : null,
            //             coin: data.coin ? getAssetByType(data.coin)?.symbol : null,
            //             apr: data.apr !== "" ? data.apr : null,
            //             duration: data.duration !== "" ? data.duration : null
            //         })
            //     })
            // } catch (error: unknown) {
            //     let errorMessage = 'An unexpected error occurred';
            //     if (error instanceof Error) {
            //         errorMessage = error.message;
            //     }
            //     toast.error(errorMessage);
            // } finally {
            //     setSubmitLoading(false)
            // }
        }
    })
    const selectedAsset = useMemo(() => {
        if (values.token_address && values.token_address !== "") {
            const assets = getChainOperatingTokens(chain.name);
            return assets.find((asset) => asset.token_address === values.token_address);
        }
    }, [chain, values.token_address, getChainOperatingTokens])

    return (
        <React.Fragment>
            <div className="modal fade" id={assetListingModalId} tabIndex={-1} aria-labelledby={`${assetListingModalId}Label`} >
                <div className="modal-dialog modal-dialog-centered modal-xl">
                    <div className="modal-content list-modal">
                        <button type="button" data-bs-dismiss="modal" aria-label="Close" id="closeAssetListingModal" className="border-0 modal-close">
                            <IoClose className="text-light close-icon" />
                        </button>
                        {
                            token &&
                            <div className="row">
                                <div className="col-lg-3 p-0">
                                    <div className="nft">
                                        <Image src={token.uri ?? chain.icon} className="asset-img" alt={token.name} width={150} height={200} />
                                    </div>
                                    <div className="nft-details">
                                        <h4 className="text-center">{token.name}</h4>
                                        <p><MdCollections className="text-light" /> {collection?.name}</p>
                                        <p><MdOutlineToken className="text-light" />{token.description}</p>
                                        <p className="desc">{JSON.stringify(token.properties)}</p>
                                    </div>

                                </div>
                                <div className="col-lg-9 p-0 ps-5">
                                    <h3>Asset Listing</h3>
                                    <form className="asset-form pt-4" onSubmit={handleSubmit} autoComplete="off">
                                        <div className="mb-3">
                                            <div className="form-group">
                                                <div className="dropdown-btn select-field">
                                                    <button type="button" className="rounded text-start w-100" onClick={() => setDropdownToken(!dropdownToken)}>
                                                        {
                                                            selectedAsset ? selectedAsset.symbol : "Any Coin"
                                                        }
                                                        <IoIosArrowDown className="dd-icon" /></button>
                                                </div>
                                            </div>
                                            <div className="coll-dropdown rounded select-dropdown" hidden={dropdownToken}>
                                                <div className="coll-item" onClick={() => {
                                                    setFieldValue("coin", "");
                                                    setDropdownToken(!dropdownToken)
                                                }}>
                                                    <p>Any Coin</p>
                                                </div>
                                                {
                                                    getChainOperatingTokens(chain.name).map(operatingToken => (
                                                        <div className="coll-item" onClick={() => {
                                                            setFieldValue("coin", operatingToken.token_address);
                                                            setDropdownToken(!dropdownToken)
                                                        }} key={operatingToken.token_address}>
                                                            <p>
                                                                <Image src={operatingToken.icon} alt={operatingToken.name} height={22} width={22} />
                                                                {operatingToken.symbol}
                                                            </p>
                                                        </div>
                                                    ))}
                                            </div>
                                            {errors.token_address && touched.token_address && <span className="text-danger">{errors.token_address}</span>}
                                        </div>
                                        <div className="mb-3">
                                            <input type="text" name="amount" value={values.amount} onChange={handleChange} placeholder="Enter Amount" className="form-control" />
                                            {errors.amount && touched.amount && <span className="text-danger">{errors.amount}</span>}
                                        </div>
                                        <div className="mb-3">
                                            <input type="text" name="duration" value={values.duration} onChange={handleChange} placeholder={`Enter Duration (1 day - 365 days)`} className="form-control" />
                                            {errors.duration && touched.duration && <span className="text-danger">{errors.duration}</span>}
                                        </div>
                                        <div className="mb-3">
                                            <input type="text" name="apr" value={values.apr} onChange={handleChange} className="form-control" placeholder="Enter APR (%)" />
                                            {errors.apr && touched.apr && <span className="text-danger">{errors.apr}</span>}
                                        </div>
                                        {
                                            submitLoading
                                                ?
                                                <ButtonLoading className="submit-btn" />
                                                :
                                                <input type="submit" className="submit-btn rounded" />
                                        }
                                    </form>
                                    <p className="mt-4 notice"><strong>Notice:</strong>This action is entirely free of transaction gas fees and won&apos;t impact your NFT ownership! Plus, all details above are optional.</p>
                                </div>
                            </div>
                        }
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}