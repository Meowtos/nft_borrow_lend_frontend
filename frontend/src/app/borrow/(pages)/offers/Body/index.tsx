"use client"
import { Loan } from "@/types/ApiInterface";
import { aptos, getObjectAddressFromEvent } from "@/utils/aptos";
import { ABI_ADDRESS } from "@/utils/env";
import { useWallet } from "@aptos-labs/wallet-adapter-react"
import React, { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { useApp } from "@/context/AppProvider";
import Image from "next/image";
import { ButtonLoading } from "@/components/ButtonLoading";
import { AcceptModal, acceptOfferModalId } from "../AcceptModal";
export function Body() {
    const { getAssetByType } = useApp();
    const { account, signAndSubmitTransaction } = useWallet();
    const [offers, setOffers] = useState<Loan[]>([]);
    const [selectedOffer, setSelectedOffer] = useState<Loan|null>(null)
    const fetchOffers = useCallback(async () => {
        if (!account?.address) return;
        const res = await fetch(`/api/lend?forAddress=${account.address}&status=pending`);
        const response = await res.json();
        if (res.ok) {
            setOffers(response.data);
        }
    }, [account?.address]);
    const onBorrow = async (object: string) => {
        if (!account?.address) return;
        const response = await signAndSubmitTransaction({
            sender: account.address,
            data: {
                function: `${ABI_ADDRESS}::nft_lending::borrow`,
                typeArguments: [],
                functionArguments: [
                    object
                ]
            }
        });
        await aptos.waitForTransaction({
            transactionHash: response.hash
        })
        const borrowObject = await getObjectAddressFromEvent(response.hash, `BorrowEvent`, `borrow_object`);
        fetch("/api/borrow", {
            method: "POST",
            headers: {
                contentType: "application/json"
            },
            body: JSON.stringify({
                object: borrowObject,
                loan: object
            })
        }).then(() => {
            toast.success("borrow success")
        }).catch((error) => {
            toast.error(error.message)
        })
    }
    useEffect(() => {
        fetchOffers()
    }, [fetchOffers])
    return (
        <React.Fragment>
            <table className="table">
                <thead>
                    <tr>
                        <th>Token</th>
                        <th>Collection</th>
                        <th>Amount</th>
                        <th>Duration in days</th>
                        <th>APR %</th>
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
                                        <button className="action-btn rounded" onClick={() => setSelectedOffer(offer)} data-bs-toggle="modal" data-bs-target={`#${acceptOfferModalId}`}>Accept Offer</button>
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
            <AcceptModal offer={selectedOffer} />
        </React.Fragment>
    )
}