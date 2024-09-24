"use client";
import React, { useState } from "react";
import { useApp } from "@/context/AppProvider";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { toast } from "sonner";
import { IoClose, IoCheckmark } from 'react-icons/io5'

import { aptos } from "@/utils/aptos";
import { Loan } from "@/types/ApiInterface";
import { ABI_ADDRESS, NETWORK } from "@/utils/env";
import { explorerUrl } from "@/utils/constants";
import Image from "next/image";
import { MdCollections, MdOutlineToken } from "react-icons/md";

export const repayModalId = "repayModal";
interface RepayModalProps {
    offer: Loan | null
}
export function RepayModal({ offer }: RepayModalProps) {
    const { getAssetByType } = useApp();
    const { account, signAndSubmitTransaction, network } = useWallet();
    const [loading, setLoading] = useState(false)
    const onRepayLoan = async (offer: Loan) => {
        if (!account?.address || !offer.borrow_obj) return;
        try {
            if (network?.name !== NETWORK) {
                throw new Error(`Switch to ${NETWORK} network`)
            }
            const coin = getAssetByType(offer.coin);
            if (!coin) return;
            const typeArguments = [];
            if (coin.token_standard === "v1") {
                typeArguments.push(coin.asset_type)
            }
            const functionArguments = [
                offer.borrow_obj
            ];
            setLoading(true)
            const response = await signAndSubmitTransaction({
                sender: account.address,
                data: {
                    function: `${ABI_ADDRESS}::nft_lending::${coin.token_standard === "v1" ? "repay_with_coin" : "repay_with_fa"}`,
                    typeArguments,
                    functionArguments
                },
            });
            await aptos.waitForTransaction({
                transactionHash: response.hash
            })
            const res = await fetch(`/api/lend/repay/${offer._id}`, {
                method: "PUT",
                headers: {
                    contentType: "application/json"
                },
                body: JSON.stringify({ address: account.address })
            });
            const apiRes = await res.json();
            if (!res.ok) {
                throw new Error(apiRes.message)
            }
            document.getElementById("closeRepayModal")?.click()
            toast.success("Loan repayed", {
                action: <a href={`${explorerUrl}/txn/${response.hash}`} target="_blank">View Txn</a>,
                icon: <IoCheckmark />
            })
            const discordId = apiRes.data;
            if (discordId) {
                await fetch(`api/discord-bot/send-user-embed`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        recepient_id: discordId,
                        title: "Loan Repayed",
                        description: `Your loan for ${offer.forListing.token_name} has been repayed.`,
                        image: offer.forListing.token_icon,
                        url: `${window.location.origin}/lend/loans`,
                        timestamp: Date.now().toString(),
                        txnUrl: `${explorerUrl}/txn/${response.hash}`
                    })
                });
            }
        } catch (error) {
            let errorMessage = typeof error === "string" ? error : `An unexpected error has occured`;
            if (error instanceof Error) {
                errorMessage = error.message;
            }
            toast.error(errorMessage)
        } finally {
            setLoading(false)
        }
    }
    return (
        <React.Fragment>
            <div className="modal fade" id={repayModalId} tabIndex={-1} aria-labelledby={`${repayModalId}Label`} >
                <div className="modal-dialog modal-dialog-centered modal-xl">
                    <div className="modal-content list-modal">
                        <button type="button" data-bs-dismiss="modal" aria-label="Close" id="closeRepayModal" className="border-0 modal-close">
                            <IoClose className="text-light close-icon" />
                        </button>
                        {
                            offer &&
                            <div className="row">
                                <div className="col-lg-3 p-0">
                                    <div className="nft">
                                        <Image src={offer.forListing.token_icon} className="asset-img" alt={offer.forListing.token_name} width={150} height={200} />
                                    </div>
                                    <div className="nft-details">
                                        <h4 className="text-center">{offer.forListing.token_name}</h4>
                                        <p><MdCollections className="text-light" /> {offer.forListing.collection_name}</p>
                                        <p><MdOutlineToken className="text-light" />{offer.forListing.token_standard}</p>
                                    </div>
                                </div>
                                <div className="col-lg-9 p-0 ps-5">
                                    <h3>Repay Loan</h3>
                                    <p className="mt-4 notice"><strong>Notice:</strong> Upon repaying the loan, you'll transfer the loan amount with interest and instantly receive your NFT back—no extra fees will be charged by escrow.</p>
                                    {
                                        !loading
                                            ?
                                            <button className="connect-btn mt-3 rounded" onClick={() => onRepayLoan(offer)}>Repay Loan</button>
                                            :
                                            <button className="connect-btn mt-3 rounded">Loading...</button>
                                    }
                                </div>
                            </div>
                        }
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}