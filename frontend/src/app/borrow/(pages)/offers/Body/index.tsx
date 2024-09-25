"use client"
import { Loan } from "@/types/ApiInterface";
import { useWallet } from "@aptos-labs/wallet-adapter-react"
import React, { useCallback, useEffect, useState } from "react";
import { useApp } from "@/context/AppProvider";
import Image from "next/image";
import { AcceptModal, acceptOfferModalId } from "../AcceptModal";
import { IoNewspaperOutline } from "react-icons/io5";
import { useKeylessAccounts } from "@/core/useKeylessAccounts";
export function Body() {
    const { getAssetByType } = useApp();
    const { activeAccount } = useKeylessAccounts()
    const { account } = useWallet();
    const [offers, setOffers] = useState<Loan[]>([]);
    const [selectedOffer, setSelectedOffer] = useState<Loan | null>(null);
    const [loading, setLoading] = useState(true)
    const fetchOffers = useCallback(async () => {
        if (!account?.address && activeAccount) return;
        try {
            const address = activeAccount ? activeAccount?.accountAddress?.toString() : account?.address;
            if(!address){
                throw new Error("Address not found")
            }
            const res = await fetch(`/api/lend?forAddress=${address}&status=pending`);
            const response = await res.json();
            if (res.ok) {
                setOffers(response.data);
            }
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
       
    }, [account?.address, activeAccount]);

    useEffect(() => {
        fetchOffers()
    }, [fetchOffers])

    return (
        <React.Fragment>
            <h4 className="loans-title">Offers Received</h4>

            <div className="overflow-auto">
                <table className="table mt-3 offers-table">
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
                            loading ?
                            Array.from({ length: 3   }).map((_, index) => (
                                <tr key={index}>
                                    <td className="text-center"><span className="line"></span></td>
                                    <td className="text-center"><span className="line"></span></td>
                                    <td className="text-center"><span className="line"></span></td>
                                    <td className="text-center"><span className="line"></span></td>
                                    <td className="text-center"><span className="line"></span></td>
                                    <td className="text-end"><span className="line"></span></td>
                                </tr>
                            ))
                            :
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
                                    <td colSpan={6} className="text-center">
                                        <div className="empty-box text-center py-5 px-3 mt-2 mb-2 rounded">
                                            <IoNewspaperOutline className="fs-1" />
                                            <p className="mt-2 w-100 text-center">No Offers Received</p>
                                        </div>
                                    </td>
                                </tr>
                            )
                        }
                    </tbody>
                </table>
            </div>
            <AcceptModal offer={selectedOffer} fetchOffers={fetchOffers} />
        </React.Fragment>
    )
}