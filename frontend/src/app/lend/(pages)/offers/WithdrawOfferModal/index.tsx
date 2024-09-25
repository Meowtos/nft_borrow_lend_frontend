"use client";
import React, { useState } from "react";
import { PendingTransactionResponse, useWallet } from "@aptos-labs/wallet-adapter-react";
import { toast } from "sonner";
import { IoCheckmark, IoClose } from 'react-icons/io5'
import { aptos } from "@/utils/aptos";
import { ABI_ADDRESS, NETWORK } from "@/utils/env";
import { explorerUrl } from "@/utils/constants";
import { Loan } from "@/types/ApiInterface";
import { useApp } from "@/context/AppProvider";
import Image from "next/image";
import { MdCollections, MdOutlineToken } from "react-icons/md";
import { useKeylessAccounts } from "@/core/useKeylessAccounts";
import { InputGenerateTransactionPayloadData } from "@aptos-labs/ts-sdk";
export const withdrawOfferModalId = "grabModal";
interface WithdrawOfferModalProps {
    offer: Loan | null;
    getUserLoanOffers: () => Promise<void>
}
export function WithdrawOfferModal({ offer, getUserLoanOffers }: WithdrawOfferModalProps) {
    const { activeAccount } = useKeylessAccounts();
    const { getAssetByType } = useApp();
    const { account, signAndSubmitTransaction, network } = useWallet();
    const [loading, setLoading] = useState(false)
    const onWithdrawOffer = async (offer: Loan) => {
        if (!account && !activeAccount) {
            return toast.error("Connect your wallet")
        };
        try {
            if(account?.address && network?.name !== NETWORK) {
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
            let response: PendingTransactionResponse;
            const data: InputGenerateTransactionPayloadData = {
                function: `${ABI_ADDRESS}::nft_lending::${coin.token_standard === "v2" ? "withdraw_with_fa" : "withdraw_with_coin"}`,
                typeArguments,
                functionArguments,
            }
            if(activeAccount){
                const transaction =  await aptos.transaction.build.simple({
                    sender: activeAccount.accountAddress,
                    data,
                });
                response =  await aptos.signAndSubmitTransaction({ signer: activeAccount, transaction });
            } else {
                response = await signAndSubmitTransaction({
                    sender: account?.address,
                    data 
                });
            }
            await aptos.waitForTransaction({
                transactionHash: response.hash
            })
            await fetch(`/api/lend/${offer._id}`, {
                method: "DELETE"
            });
            document.getElementById("closeWithdrawModal")?.click()
            toast.success("Transaction succeed", {
                action: <a href={`${explorerUrl}/txn/${response.hash}`} target="_blank">View Txn</a>,
                icon: <IoCheckmark />
            })
            await getUserLoanOffers()
           
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
                <div className="modal-dialog modal-dialog-centered modal-xl">
                    <div className="modal-content list-modal">
                        <button type="button" data-bs-dismiss="modal" aria-label="Close" id="closeWithdrawModal" className="border-0 modal-close">
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
                                    <h3>Cancel offer</h3>
                                    <p className="mt-4 notice"><strong>Notice:</strong> Once the offer is closed, your collateral held in escrow will be returned to you promptly.</p>

                                    {
                                        !loading
                                            ?
                                            <button className="connect-btn mt-3 rounded" onClick={() => onWithdrawOffer(offer)}>Cancel offer</button>
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