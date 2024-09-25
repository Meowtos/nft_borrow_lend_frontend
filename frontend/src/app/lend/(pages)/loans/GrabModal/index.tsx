"use client";
import React, { useState } from "react";
import { PendingTransactionResponse, useWallet } from "@aptos-labs/wallet-adapter-react";
import { toast } from "sonner";
import { IoCheckmark, IoClose } from 'react-icons/io5'
import { aptos } from "@/utils/aptos";
import { ABI_ADDRESS, NETWORK } from "@/utils/env";
import { explorerUrl } from "@/utils/constants";
import { Loan } from "@/types/ApiInterface";
import Image from "next/image";
import { MdCollections, MdOutlineToken } from "react-icons/md";
import { useKeylessAccounts } from "@/core/useKeylessAccounts";
import { InputGenerateTransactionPayloadData } from "@aptos-labs/ts-sdk";
export const grabModalId = "grabModal";
interface GrabModalProps {
    offer: Loan | null;
    fetchLoans: () => Promise<void>;
}
export function GrabModal({ offer, fetchLoans }: GrabModalProps) {
    const { activeAccount } = useKeylessAccounts()
    const { account, signAndSubmitTransaction, network } = useWallet();
    const [loading, setLoading] = useState(false)
    const onGrab = async (offer: Loan) => {
        if ((!account?.address && !activeAccount) || !offer.borrow_obj) return;
        try {
            if (account?.address && network?.name !== NETWORK) {
                throw new Error(`Switch to ${NETWORK} network`)
            }
            const functionArguments = [
                offer.borrow_obj
            ];
            setLoading(true);
            let response: PendingTransactionResponse;
            const data: InputGenerateTransactionPayloadData = {
                function: `${ABI_ADDRESS}::nft_lending::grab`,
                typeArguments: [],
                functionArguments
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
            const res = await fetch(`/api/lend/grab/${offer._id}`, {
                method: "PUT",
                headers: {
                    contentType: "application/json"
                },
                body: JSON.stringify({ address: activeAccount ? activeAccount?.accountAddress?.toString() : account?.address })
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
            await fetchLoans()
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
                        <button type="button" data-bs-dismiss="modal" aria-label="Close" id="closeGrabModal" className="border-0 modal-close">
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
                                    <h3>Get NFT</h3>
                                    <p className="mt-4 notice"><strong>Notice:</strong> If the borrower fails to repay the loan within the agreed timeframe, you have the right to claim their NFT from the escrowed collateral. To initiate this, you&apos;ll need to sign a transaction and call the contract manually. Once signed, the NFT will be transferred to your wallet securely, ensuring a smooth process with no additional fees.</p>
                                    {
                                        !loading
                                            ?
                                            <button className="connect-btn mt-3 rounded" onClick={() => onGrab(offer)}>Get NFT</button>
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