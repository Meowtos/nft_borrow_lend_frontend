"use client";
import { useCallback, useEffect, useState } from "react";
import { Loan } from "@/types/ApiInterface";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import Image from "next/image";
import { useApp } from "@/context/AppProvider";
import { WithdrawOfferModal, withdrawOfferModalId } from "../WithdrawOfferModal";
import { IoNewspaperOutline } from "react-icons/io5";
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
    // if (loading) return <Loading />;
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
                            loading ? (
                                Array.from({ length: 3 }).map((_, index) => (
                                    <tr key={index}>
                                        <td className="text-center"><span className="line"></span></td>
                                        <td className="text-center"><span className="line"></span></td>
                                        <td className="text-center"><span className="line"></span></td>
                                        <td className="text-center"><span className="line"></span></td>
                                        <td className="text-center"><span className="line"></span></td>
                                        <td className="text-end"><span className="line"></span></td>
                                    </tr>
                                ))
                            ) : (
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
                                        <td colSpan={9} className="text-center">
                                            <div className="empty-box text-center py-5 px-3 mt-2 mb-2 rounded">
                                                <IoNewspaperOutline className="fs-1" />
                                                <p className="mt-2 w-100 text-center">No Offers Sent</p>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            )
                        }
                    </tbody>
                </table>
            </div>
            <WithdrawOfferModal offer={withdrawOffer} getUserLoanOffers={getUserLoanOffers}/>
        </>
    )
}