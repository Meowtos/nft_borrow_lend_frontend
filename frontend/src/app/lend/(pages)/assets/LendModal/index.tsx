"use client";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useApp } from "@/context/AppProvider";
import { PendingTransactionResponse, useWallet } from "@aptos-labs/wallet-adapter-react";
import { toast } from "sonner";
import { useFormik } from "formik";
import Image from 'next/image'
import { IoIosArrowDown } from 'react-icons/io'
import { IoCheckmark, IoClose } from 'react-icons/io5'
import { APR_DENOMINATOR, aptos, getAssetBalance, MAX_LOCK_DURATION } from "@/utils/aptos";
import * as Yup from "yup";
import { ButtonLoading } from "@/components/ButtonLoading";
import { IListingSchema } from "@/models/listing";
import { ABI_ADDRESS, NETWORK } from "@/utils/env";
import { MdCollections, MdOutlineToken } from "react-icons/md";
import { explorerUrl } from "@/utils/constants";
import { useKeylessAccounts } from "@/core/useKeylessAccounts";
import { InputGenerateTransactionPayloadData } from "@aptos-labs/ts-sdk";
import { interestAmount } from "@/utils/math";

export const lendModalId = "lendModal";
interface LendModalProps {
    token: IListingSchema | null
}
export function LendModal({ token }: LendModalProps) {
    const { assets, getAssetByType } = useApp();
    const { activeAccount } = useKeylessAccounts();
    const { account, signAndSubmitTransaction, network } = useWallet();
    const [dropdownToken, setDropdownToken] = useState(true);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [balance, setBalance] = useState(0)
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
            duration: Yup.number().min(1, "Minimum 1 day required").max(MAX_LOCK_DURATION, `Max ${MAX_LOCK_DURATION} day allowed`).required("Duration is required"),
            apr: Yup.number().positive("Apr must be +ve").required("Apr is required"),
        }),
        onSubmit: async (data) => {
            if ((!account?.address && !activeAccount) || !token) return;
            setSubmitLoading(true)
            try {
                const coin = assets.find((asset) => asset.asset_type === data.coin);
                if (!coin) {
                    throw new Error("No coin")
                };
                if (account?.address && network?.name !== NETWORK) {
                    throw new Error(`Switch to ${NETWORK} network`)
                }

                const decimals = coin.decimals;
                const apr = Number(data.apr) * APR_DENOMINATOR;
                const amount = Number(data.amount) * Math.pow(10, decimals);
                const typeArguments = [];
                if (coin.token_standard === "v1") {
                    typeArguments.push(coin.asset_type)
                }
                const functionArguments = [
                    token.token_data_id,
                    amount,
                    data.duration,
                    apr,
                ];
                if (coin.token_standard === "v2") {
                    functionArguments.push(coin.asset_type);
                };
                let response: PendingTransactionResponse;
                const inputTrasactionData: InputGenerateTransactionPayloadData = {
                    function: `${ABI_ADDRESS}::nft_lending::${coin.token_standard === "v2" ? "offer_with_fa" : "offer_with_coin"}`,
                    typeArguments,
                    functionArguments,
                }
                if(activeAccount){
                    const transaction =  await aptos.transaction.build.simple({
                        sender: activeAccount.accountAddress,
                        data: inputTrasactionData,
                    });
                    response =  await aptos.signAndSubmitTransaction({ signer: activeAccount, transaction });
                } else {
                    response = await signAndSubmitTransaction({
                        sender: account?.address,
                        data: inputTrasactionData
                    })
                }
              
                await aptos.waitForTransaction({
                    transactionHash: response.hash
                })
                const transaction = await aptos.getTransactionByHash({ transactionHash: response.hash });
                const eventType = `${ABI_ADDRESS}::nft_lending::OfferEvent`;
                let offerObj = "";
                if (transaction.type === "user_transaction") {
                    const event = transaction.events.find((event) => event.type === eventType);
                    if (event) {
                        offerObj = event.data["object"];
                    }
                }
                const res = await fetch("/api/lend", {
                    method: "POST",
                    body: JSON.stringify({
                        address: activeAccount ? activeAccount?.accountAddress?.toString() : account?.address,
                        forListing: token._id,
                        coin: data.coin,
                        amount: data.amount,
                        duration: data.duration,
                        apr: data.apr,
                        offer_obj: offerObj,
                        hash: response.hash,
                    })
                });
                const apiRes = await res.json();
                if (!res.ok) {
                    throw new Error(apiRes.message)
                }
                document.getElementById("closeLendModal")?.click();
                toast("Transaction succeed", {
                    action: <a href={`${explorerUrl}/txn/${response.hash}`} target="_blank">View Txn</a>,
                    icon: <IoCheckmark />
                })
                const discordId = apiRes.data;
                if (discordId) {
                    await fetch(`/api/discord-bot/send-user-embed`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            recepient_id: discordId,
                            title: `You have received an offer on ${token.token_name}`,
                            image: token.token_icon,
                            url: `${window.location.origin}/borrow/offers`,
                            timestamp: Date.now().toString(),
                            txnUrl: `${explorerUrl}/txn/${response.hash}`,
                            amount: data.amount,
                            coin: getAssetByType(data.coin)?.symbol,
                            apr: data.apr,
                            duration: data.duration
                        })
                    });
                }

            } catch (error: unknown) {
                let errorMessage = `An unexpected error has occured`;
                if (typeof error === "string") {
                    errorMessage = error;
                }
                if (error instanceof Error) {
                    errorMessage = error.message
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
    const getBalance = useCallback(async () => {
        if ((!account?.address && !activeAccount) || !chosenCoin) {
            return setBalance(0)
        }
        try {
            const address = activeAccount ? activeAccount?.accountAddress?.toString() : account?.address;
            if(!address){
                throw new Error("Address not found")
            }
            const res = await getAssetBalance(address, chosenCoin.asset_type, chosenCoin.token_standard);
            setBalance(res / Math.pow(10, chosenCoin.decimals))
        } catch (error) {
            console.error(error)
        }
    }, [chosenCoin, account?.address, activeAccount]);
    useEffect(() => {
        getBalance()
    }, [getBalance])
    useEffect(() => {
        if (token) {
            setFieldValue("coin", token.coin ?? "");
            setFieldValue("amount", token.amount ?? "")
            setFieldValue("duration", token.duration ?? "")
            setFieldValue("apr", token.apr ?? "")
        }
    }, [setFieldValue, token])
    const receiveAmount = useMemo(()=>{
        return Number(values.amount) + interestAmount(Number(values.apr), Number(values.amount), Number(values.duration))
    },[values.amount, values.apr, values.duration])
    return (
        <React.Fragment>
            <div className="modal fade" id={lendModalId} tabIndex={-1} aria-labelledby={`${lendModalId}Label`} >
                <div className="modal-dialog modal-dialog-centered modal-xl">
                    <div className="modal-content list-modal">
                        <button type="button" data-bs-dismiss="modal" aria-label="Close" id="closeLendModal" className="border-0 modal-close">
                            <IoClose className="text-light close-icon" />
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
                                        <p><MdCollections className="text-light" /> {token.collection_name}</p>
                                        <p><MdOutlineToken className="text-light" />{token.token_standard}</p>
                                    </div>

                                </div>
                                <div className="col-lg-9 p-0 ps-5">
                                    <h3>Asset Listing</h3>
                                    <form className="asset-form pt-4" onSubmit={handleSubmit} autoComplete="off">
                                        <div className="mb-3">
                                            Balance : {balance.toString()}
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
                                                        chosenCoin ? chosenCoin.symbol : "Any"
                                                    }
                                                    <IoIosArrowDown className="dd-icon" />
                                                </div>
                                            </div>
                                            <div className="coll-dropdown rounded select-dropdown" hidden={dropdownToken}>
                                                {
                                                    assets.map(fa => (
                                                        <div className="coll-item" onClick={() => {
                                                            setFieldValue("coin", fa.asset_type);
                                                            setDropdownToken(!dropdownToken)
                                                        }} key={fa.asset_type}>
                                                            <p>
                                                                {fa.symbol}</p>
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
                                        <div className="mb-3">
                                            <p className="mb-0">After repay, you'll get - {receiveAmount ?? 0} {chosenCoin?.symbol}</p>
                                        </div>
                                        {
                                            submitLoading
                                                ?
                                                <ButtonLoading className="submit-btn" />
                                                :
                                                <input type="submit" className="submit-btn" />
                                        }
                                    </form>
                                    <p className="mt-4 notice"><strong>Notice:</strong>Your collateral is securely held in escrow at this stage. Once the borrower accepts the offer, the loan period begins and collateral is transferred to borrower, and you&apos;ll receive your collateral with interest after the borrower completes repayment.</p>
                                </div>
                            </div>
                        }
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}