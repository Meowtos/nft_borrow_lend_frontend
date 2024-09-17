"use client"
import { Loan } from "@/types/ApiInterface";
import { aptos } from "@/utils/aptos";
import { ABI_ADDRESS } from "@/utils/env";
import { useWallet } from "@aptos-labs/wallet-adapter-react"
import React, { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { useApp } from "@/context/AppProvider";
import Image from "next/image";
import { AcceptModal } from "../AcceptModal";
export function Body() {
    const { getAssetByType } = useApp();
    const { account, signAndSubmitTransaction } = useWallet();
    const [offers, setOffers] = useState<Loan[]>([]);
    const [selectedOffer, setSelectedOffer] = useState<Loan | null>(null)
    const fetchOffers = useCallback(async () => {
        if (!account?.address) return;
        const res = await fetch(`/api/lend?forAddress=${account.address}&status=pending`);
        const response = await res.json();
        if (res.ok) {
            setOffers(response.data);
        }
    }, [account?.address]);
    const onBorrow = async (offer: Loan) => {
        setSelectedOffer(offer)
        if (!account?.address) return;
        try {
            const coin = getAssetByType(offer.coin);
            if (!coin) return;
            const typeArguments = [];

            if (coin.token_standard === "v1") {
                typeArguments.push(coin.asset_type);
            }
            const functionArguments = [
                offer.offer_obj,
            ];
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
                console.log(apiRes)
                throw new Error(apiRes.message)
            }
            toast.success("Offer accepted")
        } catch (error: unknown) {
            let errorMessage = typeof error === "string" ? error : `An unexpected error has occured`;
            if (error instanceof Error) {
                errorMessage = error.message;
            }
            toast.error(errorMessage)
        }
    }
    useEffect(() => {
        fetchOffers()
    }, [fetchOffers])

    return (
        <React.Fragment>
            <div className="overflow-auto">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Token</th>
                            <th>Collection</th>
                            <th>Amount</th>
                            <th>Duration(days)</th>
                            <th>APR(%)</th>
                            <th className="text-end">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            offers.length > 0 ? (
                                offers.map((offer, index) => (
                                    <tr key={index}>
                                        <td>
                                            <Image src={offer.forListing.token_icon} className="rounded me-2" alt={offer.forListing.token_name} width={37} height={37} />
                                            <span>{offer.forListing.token_name}</span>
                                        </td>
                                        <td>{offer.forListing.collection_name}</td>
                                        <td>{offer.amount} {getAssetByType(offer.coin)?.symbol}</td>
                                        <td>{offer.duration}</td>
                                        <td>{offer.apr}</td>
                                        <td className="text-end">
                                            <button className="action-btn rounded" onClick={() => onBorrow(offer)} >Accept Offer</button>
                                            {/* data-bs-toggle="modal" data-bs-target={`#${acceptOfferModalId}`} */}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="text-center"><p className="p-3">No offers received</p></td>
                                </tr>
                            )
                        }
                    </tbody>
                </table>
            </div>
            <AcceptModal offer={selectedOffer} />
        </React.Fragment>
    )
}