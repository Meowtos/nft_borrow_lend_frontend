"use client";
import React, { useState } from "react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { toast } from "sonner";
import { IoCheckmark, IoClose } from 'react-icons/io5'
import { aptos } from "@/utils/aptos";
import { ABI_ADDRESS } from "@/utils/env";
import { explorerUrl } from "@/utils/constants";
import { Loan } from "@/types/ApiInterface";

export const grabModalId = "grabModal";
interface GrabModalProps {
    offer: Loan | null
}
export function GrabModal({ offer }: GrabModalProps) {
    const { account, signAndSubmitTransaction } = useWallet();
    const [loading, setLoading] = useState(false)
    const onGrab = async (offer: Loan) => {
        if (!account?.address || !offer.borrow_obj) return;
        try {
            const functionArguments = [
                offer.borrow_obj
            ];
            setLoading(true)
            const response = await signAndSubmitTransaction({
                sender: account.address,
                data: {
                    function: `${ABI_ADDRESS}::nft_lending::grab`,
                    typeArguments: [],
                    functionArguments
                },
            });
            await aptos.waitForTransaction({
                transactionHash: response.hash
            })
            const res = await fetch(`/api/lend/grab/${offer._id}`, {
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
            document.getElementById("closeGrabModal")?.click()
            toast.success("Transaction succeed", {
                action: <a href={`${explorerUrl}/txn/${response.hash}`} target="_blank">View Txn</a>,
                icon: <IoCheckmark />
            })
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
            <div className="modal fade" id={grabModalId} tabIndex={-1} aria-labelledby={`${grabModalId}Label`} >
                <div className="modal-dialog modal-dialog-centered modal-xl">
                    <div className="modal-content list-modal">
                        <button type="button" data-bs-dismiss="modal" aria-label="Close" id="closeGrabModal">
                            <IoClose className="text-light close-icon" />
                        </button>
                        {
                            offer &&
                            <div className="row">
                                Repayment failed by user ${offer.forAddress}. Claim nft to your wallet
                                {
                                    loading
                                        ?
                                        <button className="action-btn">Loading...</button>
                                        :
                                        <button className="action-btn" onClick={() => onGrab(offer)}>Get NFT</button>
                                }
                            </div>
                        }
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}