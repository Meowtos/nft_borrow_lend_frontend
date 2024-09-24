"use client";

import { Loan } from "@/types/ApiInterface";
import Image from "next/image";
import { IoCheckmark, IoClose } from "react-icons/io5";
import { MdCollections, MdOutlineToken } from "react-icons/md";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { useApp } from "@/context/AppProvider";
import { ABI_ADDRESS, NETWORK } from "@/utils/env";
import { aptos } from "@/utils/aptos";
import { toast } from "sonner";
import { useState } from "react";
import { explorerUrl } from "@/utils/constants";
export const acceptOfferModalId = "acceptOfferModal";
interface AcceptModalProps {
    offer: Loan | null;
    fetchOffers: () => Promise<void>
}
export function AcceptModal({ offer, fetchOffers }: AcceptModalProps) {
    const { getAssetByType } = useApp();
    const { account, signAndSubmitTransaction, network } = useWallet();
    const [loading, setLoading] = useState(false);
    const onBorrow = async (offer: Loan) => {
        if (!account?.address) return;
        try {
            if (network?.name !== NETWORK) {
                throw new Error(`Switch to ${NETWORK} network`)
            }
            const coin = getAssetByType(offer.coin);
            if (!coin) return;
            const typeArguments = [];

            if (coin.token_standard === "v1") {
                typeArguments.push(coin.asset_type);
            }
            const functionArguments = [
                offer.offer_obj,
            ];
            setLoading(true)
            const response = await signAndSubmitTransaction({
                sender: account.address,
                data: {
                    function: `${ABI_ADDRESS}::nft_lending::${coin.token_standard === "v1" ? "borrow_with_coin" : "borrow_with_fa"}`,
                    typeArguments,
                    functionArguments,
                }
            });
            await aptos.waitForTransaction({
                transactionHash: response.hash
            });
            const transaction = await aptos.getTransactionByHash({ transactionHash: response.hash });
            const eventType = `${ABI_ADDRESS}::nft_lending::BorrowEvent`;
            let borrowObj = "";
            let borrowTimestamp = 0;
            if (transaction.type === "user_transaction") {
                const event = transaction.events.find((event) => event.type === eventType);
                if (event) {
                    borrowObj = event.data["object"];
                    borrowTimestamp = event.data["timestamp"];
                }
            }
            const res = await fetch(`/api/lend/accept/${offer._id}`, {
                method: "PUT",
                headers: {
                    contentType: "application/json"
                },
                body: JSON.stringify({
                    address: account.address,
                    borrow_obj: borrowObj,
                    start_timestamp: borrowTimestamp,
                })
            });
            const apiRes = await res.json();
            if (!res.ok) {
                throw new Error(apiRes.message)
            }
            document.getElementById("closeAcceptOfferModal")?.click();
            toast.success("Offer accepted", {
                action: <a href={`${explorerUrl}/txn/${response.hash}`} target="_blank">View Txn</a>,
                icon: <IoCheckmark />
            })
            
            const discordId = apiRes.data;
            if(discordId){
                await fetch(`/api/discord-bot/send-user-embed`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        recepient_id: discordId,
                        title: `Loan started for  ${offer.forListing.token_name}`,
                        image: offer.forListing.token_icon,
                        url: `${window.location.origin}/lend/loans`,
                        txnUrl: `${explorerUrl}/txn/${response.hash}`
                    })
                });
            }
            await fetchOffers()
        } catch (error: unknown) {
            console.log({ error })
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
        <>
            <div className="modal fade" id={acceptOfferModalId} tabIndex={-1} aria-labelledby={`${acceptOfferModalId}Label`} aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered modal-xl">
                    <div className="modal-content list-modal">
                        <button type="button" id="closeAcceptOfferModal" data-bs-dismiss="modal" aria-label="Close" className="border-0 modal-close">
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
                                    <h3>Accept offer</h3>
                                    <p className="mt-4 notice"><strong>Notice:</strong> By selecting this NFT as collateral, you acknowledge that the NFT will be securely transferred and stored with us for the duration of the loan. You will not have access to this NFT until the loan is fully repaid.</p>
                                    {
                                        !loading
                                            ?
                                            <button className="connect-btn mt-3 rounded" onClick={() => onBorrow(offer)}>Accept the offer</button>
                                            :
                                            <button className="connect-btn mt-3 rounded">Loading...</button>
                                    }
                                </div>
                            </div>
                        }
                    </div>
                </div>
            </div>
        </>
    )
}