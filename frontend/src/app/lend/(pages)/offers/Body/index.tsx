"use client";
import { useCallback, useEffect, useState } from "react";
import { Loading } from "@/components/Loading";
import { Loan } from "@/types/ApiInterface";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import Image from "next/image";
import { useApp } from "@/context/AppProvider";
import { WithdrawOfferModal, withdrawOfferModalId } from "../WithdrawOfferModal";
export function Body() {
    const { account } = useWallet();
    const { getAssetByType } = useApp()
    const [loading, setLoading] = useState(true);
    const [userOffers, setUserOffers] = useState<Loan[]>([])
    const [withdrawOffer, setWithdrawOffer] = useState<Loan | null>(null)
    const getUserLoanOffers = useCallback(async () => {
        if (!account?.address) return;
        setLoading(true)
        try {
            const res = await fetch(`/api/lend?address=${account.address}&status=pending`);
            const response = await res.json();
            if (!res.ok) {
                throw new Error(response.message)
            }
            setUserOffers(response.data)
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }, [account?.address]);

    useEffect(() => {
        getUserLoanOffers();
    }, [getUserLoanOffers]);
    if (loading) return <Loading />;
    return (
        <>
            <div className="overflow-auto">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Token</th>
                            <th>Collection</th>
                            <th>Amount</th>
                            <th>Duration(days)</th>
                            <th>APR %</th>
                            <th className="text-end">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            userOffers.length > 0 ? (
                                userOffers.map((offer, index) => (
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
                                            <button className="action-btn rounded" data-bs-toggle="modal" data-bs-target={`#${withdrawOfferModalId}`} onClick={() => setWithdrawOffer(offer)}>Cancel Offer</button>

                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={9} className="text-center"><p className="p-3">No offers</p></td>
                                </tr>
                            )
                        }
                    </tbody>
                </table>
            </div>
            <WithdrawOfferModal offer={withdrawOffer} />
        </>
    )
}