"use client";
import React, { useState } from "react";
import { useApp } from "@/context/AppProvider";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { toast } from "sonner";
import { IoClose, IoCheckmark } from 'react-icons/io5'

import { aptos } from "@/utils/aptos";
import { Loan } from "@/types/ApiInterface";
import { ABI_ADDRESS, NETWORK, SERVER_URL } from "@/utils/env";
import { explorerUrl } from "@/utils/constants";

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
            if(network?.name !== NETWORK) {
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
            if(discordId) {
                await fetch(`${SERVER_URL}/borrow/${discordId}`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        token_name: offer.forListing.token_name,
                        token_icon: offer.forListing.token_icon
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
                <div className="modal-dialog modal-dialog-centered modal-md">
                    <div className="modal-content list-modal">
                        <button type="button" data-bs-dismiss="modal" aria-label="Close" id="closeRepayModal" className="border-0 modal-close">
                            <IoClose className="text-light close-icon" />
                        </button>
                        {
                            offer &&
                            <div className="row">
                                <div className="col">
                                    {
                                        loading
                                            ?
                                            <button className="action-btn rounded" onClick={() => onRepayLoan(offer)}>Repay</button>
                                            :
                                            <button className="action-btn rounded" onClick={() => onRepayLoan(offer)}>Repay</button>
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