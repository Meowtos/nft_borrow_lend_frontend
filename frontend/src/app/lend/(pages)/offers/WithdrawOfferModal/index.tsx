"use client";
import React, { useState } from "react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { toast } from "sonner";
import { IoCheckmark, IoClose } from 'react-icons/io5'
import { aptos } from "@/utils/aptos";
import { ABI_ADDRESS, NETWORK } from "@/utils/env";
import { explorerUrl } from "@/utils/constants";
import { Loan } from "@/types/ApiInterface";
import { useApp } from "@/context/AppProvider";
export const withdrawOfferModalId = "grabModal";
interface WithdrawOfferModalProps {
    offer: Loan | null
}
export function WithdrawOfferModal({ offer }: WithdrawOfferModalProps) {
    const { getAssetByType } = useApp();
    const { account, signAndSubmitTransaction, network } = useWallet();
    const [loading, setLoading] = useState(false)
    const onWithdrawOffer = async (offer: Loan) => {
        if (!account) return;
        try {
            if(network?.name !== NETWORK) {
                throw new Error(`Switch to ${NETWORK} network`)
            }
            const coin = getAssetByType(offer.coin);
            if (!coin) return;
            
            setLoading(true)
            const typeArguments = [];
            if (coin.token_standard === "v1") {
                typeArguments.push(coin.asset_type)
            }
            const functionArguments = [
                offer.offer_obj,
            ];
            const response = await signAndSubmitTransaction({
                sender: account.address,
                data: {
                    function: `${ABI_ADDRESS}::nft_lending::${coin.token_standard === "v2" ? "withdraw_with_fa" : "withdraw_with_coin"}`,
                    typeArguments,
                    functionArguments,
                }
            });
            await aptos.waitForTransaction({
                transactionHash: response.hash
            })
            document.getElementById("closeWithdrawModal")?.click()
            toast.success("Transaction succeed", {
                action: <a href={`${explorerUrl}/txn/${response.hash}`} target="_blank">View Txn</a>,
                icon: <IoCheckmark />
            })
           
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
            setLoading(false)
        }
    }
    return (
        <React.Fragment>
            <div className="modal fade" id={withdrawOfferModalId} tabIndex={-1} aria-labelledby={`${withdrawOfferModalId}Label`} >
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content list-modal">
                        <button type="button" data-bs-dismiss="modal" aria-label="Close" id="closeWithdrawModal" className="border-0 modal-close">
                            <IoClose className="text-light close-icon" />
                        </button>
                        {
                            offer &&
                            <div className="row">
                                <h4 className="text-center mt-4">Are you sure you want to close the offer?</h4>
                                {
                                    loading
                                        ?
                                        <button className="connect-btn mt-4 rounded">Loading...</button>
                                        :
                                        <button className="connect-btn mt-4 rounded" onClick={() => onWithdrawOffer(offer)}>Withdraw offer</button>
                                }
                            </div>
                        }
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}