"use client";
import React, { useMemo, useState } from "react";
import { useApp } from "@/context/AppProvider";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { toast } from "sonner";
import { useFormik } from "formik";
import Image from 'next/image'
import { IoIosArrowDown } from 'react-icons/io'
import { IoClose } from 'react-icons/io5'
import { APR_DENOMINATOR, aptos, getObjectAddressFromEvent, MAX_LOCK_DURATION } from "@/utils/aptos";
import * as Yup from "yup";
import { ButtonLoading } from "@/components/ButtonLoading";
import { IListingSchema } from "@/models/listing";
import { ABI_ADDRESS } from "@/utils/env";

export const lendModalId = "lendModal";
interface LendModalProps {
    token: IListingSchema | null
}
export function LendModal({ token }: LendModalProps) {
    const { assets } = useApp();
    const { account, signAndSubmitTransaction } = useWallet();
    const [dropdownToken, setDropdownToken] = useState(true);
    const [submitLoading, setSubmitLoading] = useState(false);
    const { values, handleSubmit, handleChange, setFieldValue, errors, touched } = useFormik({
        initialValues: {
            coin: "",
            amount: "",
            duration: "",
            apr: ""
        },
        validationSchema: Yup.object({
            coin: Yup.string().required("Coin is required"),
            amount: Yup.number().typeError("Amount must be a number").positive("Amount must be +ve").required("Amount is required"),
            duration: Yup.number().min(1, "Minimum 1 day required").max(MAX_LOCK_DURATION, `Max ${MAX_LOCK_DURATION} day allowed`).required(),
            apr: Yup.number().positive("Apr must be +ve").required(),
        }),
        onSubmit: async (data) => {
            if (!account?.address || !token) return;
            setSubmitLoading(true)
            try {
                const coin = assets.find((asset) => asset.asset_type === data.coin);
            if (!coin) {
                throw new Error("No coin")
            };
            
            const decimals = coin.decimals;
            const apr = Number(data.apr) * APR_DENOMINATOR;
            const amount = Number(data.amount) * Math.pow(10, decimals);
            const typeArguments = [];
            if(coin.token_standard === "v1"){
                typeArguments.push(coin.asset_type)
            }
            const functionArguments = [
                token.token_data_id,
                amount,
                data.duration,
                apr,
            ];
            if(coin.token_standard === "v2"){
                functionArguments.push(coin.asset_type);
            };
            const response = await signAndSubmitTransaction({
                sender: account.address,
                data: {
                    function: `${ABI_ADDRESS}::nft_lending::${coin.token_standard === "v2" ? "offer_with_fa": "offer_with_coin"}`,
                    typeArguments,
                    functionArguments,
                }
            });
            toast("Waiting for the transaction", {
                action: <a href="/somwhere">View Txn</a>
            })
            await aptos.waitForTransaction({
                transactionHash: response.hash
            })
            toast.success("Transaction succeed", {
                action: <a href="/view">View Txn</a>
            })
            } catch (error) {
                let errorMessage = `An unexpected error has occured`;
                if(typeof error === "string"){
                    errorMessage = error;
                }
                toast.error(errorMessage)
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
    return (
        <React.Fragment>
            <div className="modal fade" id={lendModalId} tabIndex={-1} aria-labelledby={`${lendModalId}Label`} >
                <div className="modal-dialog modal-dialog-centered modal-xl">
                    <div className="modal-content list-modal">
                        <IoClose type="button" className="text-light close-icon" data-bs-dismiss="modal" aria-label="Close" id="closeLendModal" />
                        {
                            token &&
                            <div className="row">
                                <div className="col-lg-4 p-0">
                                    <Image src={token.token_icon ?? ""} className="w-100" alt={token.token_name} width={250} height={370} />
                                    <h5>{token.token_name}</h5>
                                </div>
                                <div className="col-lg-8 p-0 ps-5">
                                    <h3>Give Loan</h3>
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
                                                                <p>
                                                                    {/* <Image src={fa.icon_uri} alt={fa.symbol} height={20} width={20} className="rounded-pill" /> */}
                                                                    {fa.symbol} ({fa.token_standard})</p>
                                                            </div>
                                                        ))}
                                                </div>
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
                                                <input type="submit" className="submit-btn" />
                                        }
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