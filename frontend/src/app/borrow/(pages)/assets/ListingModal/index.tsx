"use client";
import React from "react";
import { useApp } from "@/context/AppProvider";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { Token } from "@/types/Token";
import { toast } from "sonner";
import { useFormik } from "formik";

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
    return (
        <React.Fragment>
            <div className="modal fade" id={assetListingModalId} tabIndex={-1} aria-labelledby={`${assetListingModalId}Label`} aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id={`${assetListingModalId}Label`}>List Asset</h1>
                            <button id="closeAssetListingModal" type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            {
                                token &&
                                <form className="p-3 border" onSubmit={handleSubmit}>
                                    <label>Select token</label>
                                    <select className="form-select" name="fa_metadata" value={values.fa_metadata} onChange={handleChange}>
                                        <option value=""></option>
                                        {
                                            assets.map(fa => (
                                                <option value={fa.asset_type} key={fa.asset_type}>{fa.symbol}</option>
                                            ))
                                        }
                                    </select>
                                    <input type="text" name="amount" value={values.amount} onChange={handleChange} placeholder="Enter Amount" />
                                    <label>Select lock duration</label>
                                    <select className="form-select" name="duration" value={values.duration} onChange={handleChange}>
                                        <option value="1">1 days</option>
                                        <option value="2">2 days</option>
                                    </select>
                                    <input type="text" name="apr" value={values.apr} onChange={handleChange} />
                                    <input type="submit" />
                                </form>
                            }
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" className="btn btn-primary">Save changes</button>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}