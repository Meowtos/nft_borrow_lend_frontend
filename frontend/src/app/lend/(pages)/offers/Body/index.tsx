"use client";
import { useCallback, useEffect, useState } from "react";
import { Loading } from "@/components/Loading";
import { Loan } from "@/types/ApiInterface";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import Image from "next/image";
import { useApp } from "@/context/AppProvider";
import { ABI_ADDRESS } from "@/utils/env";
import { toast } from "sonner";
import { aptos } from "@/utils/aptos";
import { ButtonLoading } from "@/components/ButtonLoading";
export function Body() {
    const { account, signAndSubmitTransaction } = useWallet();
    const { getAssetByType } = useApp()
    const [loading, setLoading] = useState(true);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [userOffers, setUserOffers] = useState<Loan[]>([])
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
    const onWithdrawOffer = async (offer: Loan) => {
        if (!account) return;
        try {
            const coin = getAssetByType(offer.coin);
            if (!coin) return;
            setSubmitLoading(true)
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
            toast("Waiting for the transaction", {
                action: <a href="/somwhere">View Txn</a>
            })
            await aptos.waitForTransaction({
                transactionHash: response.hash
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
            setSubmitLoading(false)
        }
    }
    useEffect(() => {
        getUserLoanOffers();
    }, [getUserLoanOffers]);
    if (loading) return <Loading />;
    return (
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
                                    {
                                        submitLoading
                                            ?
                                            <ButtonLoading className="action-btn rounded" />
                                            :
                                            <button className="action-btn rounded" onClick={() => onWithdrawOffer(offer)}>Cancel Offer</button>

                                    }
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
    )
}