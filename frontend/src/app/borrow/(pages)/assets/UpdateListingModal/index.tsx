"use client";
import React, { useEffect, useMemo, useState } from "react";
import { useApp } from "@/context/AppProvider";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { toast } from "sonner";
import { useFormik } from "formik";
import Image from 'next/image'
import { IoIosArrowDown } from 'react-icons/io'
import { IoClose } from 'react-icons/io5'
import { MdCollections } from "react-icons/md";
import { MdOutlineToken } from "react-icons/md";
import { MAX_LOCK_DURATION } from "@/utils/aptos";
import * as Yup from "yup";
import { ButtonLoading } from "@/components/ButtonLoading";
import { Listing } from "@/types/ApiInterface";
export const updateListingModalId = "updateListingModal";
interface UpdateListingModalProps {
    token: Listing | null;
    getUserListings: () => Promise<void>
}
export function UpdateListingModal({ token, getUserListings }: UpdateListingModalProps) {
    const { assets } = useApp();
    const { account } = useWallet();
    const [dropdownToken, setDropdownToken] = useState(true);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [isRemoving, setIsRemoving] = useState(false)
    const { values, handleSubmit, handleChange, setFieldValue, errors, touched } = useFormik({
        initialValues: {
            coin: "",
            amount: "",
            duration: "",
            apr: ""
        },
        validationSchema: Yup.object({
            amount: Yup.number().typeError("Amount must be a number").positive("Amount must be +ve"),
            duration: Yup.number().min(1, "Minimum 1 day required").max(MAX_LOCK_DURATION, `Max ${MAX_LOCK_DURATION} day allowed`),
            apr: Yup.number().positive("Apr must be +ve"),
        }),
        onSubmit: async (data) => {
            if (!account?.address || !token) return;
            setSubmitLoading(true)
            try {
                const formData = {
                    coin: data.coin,
                    amount: data.amount,
                    duration: data.duration,
                    apr: data.apr,
                }
                const res = await fetch(`/api/listing/${token._id}`, {
                    method: "PUT", 
                    headers: {
                        contentType: "application/json"
                    }, 
                    body: JSON.stringify(formData)
                });
                const response = await res.json();
                if(!res.ok){
                    throw new Error(response.message)
                }
                document.getElementById("closeUpdateListingModal")?.click();
                toast.success("Item updated successfully")
                await getUserListings()
            } catch (error: unknown) {
                let errorMessage = 'An unexpected error occurred';
                if (error instanceof Error) {
                    errorMessage = error.message;
                } 
                toast.error(errorMessage);
            } finally {
                setSubmitLoading(false)
            }
        }
    })
    const chosenCoin = useMemo(() => {
        if (values.coin && values.coin !== "") {
            return assets.find((asset) => asset.asset_type === values.coin);
        }
    }, [assets, values.coin])
    const onRemoveListing = async() => {
        if(!account?.address || !token) return;
        try {
            setIsRemoving(true);
            const res = await fetch(`/api/listing/${token._id}?address=${account.address}`, {
                method: "DELETE",
            });
            const response = await res.json();
            if(!res.ok){
                throw new Error(response.message)
            }
            document.getElementById("closeUpdateListingModal")?.click();
            toast.success("Item removed successfully")
            await getUserListings()
        } catch (error) {
            let errorMessage = 'An unexpected error occurred';
            if (error instanceof Error) {
                errorMessage = error.message;
            } 
            toast.error(errorMessage);
        } finally {
            setIsRemoving(false)
        }
    }
    useEffect(()=>{
        if(token){
            setFieldValue("coin", token.coin ?? "");
            setFieldValue("amount", token.amount ?? "");
            setFieldValue("duration", token.duration ?? "");
            setFieldValue("apr", token.apr ?? "");
        }
    },[setFieldValue, token])
    return (
        <React.Fragment>
            <div className="modal fade" id={updateListingModalId} tabIndex={-1} aria-labelledby={`${updateListingModalId}Label`} >
                <div className="modal-dialog modal-dialog-centered modal-xl">
                    <div className="modal-content list-modal">
                        <button type="button" data-bs-dismiss="modal" aria-label="Close" id="closeUpdateListingModal" className="border-0">
                            <IoClose  className="text-light close-icon" />
                        </button>
                        {
                            token &&
                            <div className="row">
                                <div className="col-lg-3 p-0">
                                    <div className="nft">
                                        <Image src={token.token_icon ?? ""} className="asset-img" alt={token.token_name} width={150} height={200} />
                                    </div>
                                    <div className="nft-details">
                                        <h4 className="text-center">{token.token_name}</h4>
                                        <p><MdCollections className="text-light"/> {token.collection_name}</p>
                                        <p><MdOutlineToken className="text-light"/>{token.token_standard}</p>
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
                                                            chosenCoin ? chosenCoin.symbol : "Any Coin"
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
                                                    assets.map(fa => (
                                                        <div className="coll-item" onClick={() => {
                                                            setFieldValue("coin", fa.asset_type);
                                                            setDropdownToken(!dropdownToken)
                                                        }} key={fa.asset_type}>
                                                            <p>{fa.symbol}</p>
                                                        </div>
                                                    ))}
                                            </div>
                                            {errors.coin && touched.coin && <span className="text-danger">{errors.coin}</span>}
                                        </div>
                                        <div className="mb-3">
                                            <input type="text" name="amount" value={values.amount} onChange={handleChange} placeholder="Enter Amount" className="form-control" />
                                            {errors.amount && touched.amount && <span className="text-danger">{errors.amount}</span>}
                                        </div>
                                        <div className="mb-3">
                                            <input type="text" name="duration" value={values.duration} onChange={handleChange} placeholder={`Enter Duration (1 day - ${MAX_LOCK_DURATION} days)`} className="form-control" />
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
                                                <input type="submit" className="submit-btn" value={"Update Listing"} />
                                        }
                                        <button className="btn connect-btn ms-3 text-uppercase rounded-0" type="button" onClick={onRemoveListing} disabled={isRemoving}>Remove Listing</button>
                                    </form>
                                </div>
                            </div>
                        }
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}