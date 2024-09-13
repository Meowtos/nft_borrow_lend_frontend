"use client"
import { Loan } from "@/types/ApiInterface";
import { useWallet } from "@aptos-labs/wallet-adapter-react"
import { useCallback, useEffect, useState } from "react";
import { useApp } from "@/context/AppProvider";
import { shortenAddress } from "@/utils/shortenAddress";
import Image from "next/image";
import Link from "next/link";
import { ABI_ADDRESS, NETWORK } from "@/utils/env";
import { toast } from "sonner";
import { aptos } from "@/utils/aptos";
import { interestPercentage } from "@/utils/math";
import { Loading } from "@/components/Loading";
export function Body() {
    const { account, signAndSubmitTransaction } = useWallet();
    const { getAssetByType } = useApp();
    const [loading, setLoading] = useState(true);
    const [activeLoans, setActiveLoans] = useState<Loan[]>([]);
    const [prevLoans, setPrevLoans] = useState<Loan[]>([])
    const getLoans = useCallback(async () => {
        if (!account?.address) return;
        setLoading(true)
        try {
            const res = await fetch(`/api/lend?forAddress=${account.address}&status=borrowed`);
            const response = await res.json();
            if (res.ok) {
                setActiveLoans(response.data)
            }
            const prevRes = await fetch(`/api/lend/previous?forAddress=${account.address}`);
            const prevResponse = await prevRes.json();
            if (prevRes.ok) {
                setPrevLoans(prevResponse.data)
            }
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }, [account?.address])
    const onRepayLoan = async (offer: Loan) => {
        if (!account?.address || !offer.borrow_obj) return;
        try {
            const coin = getAssetByType(offer.coin);
            if (!coin) return;
            const typeArguments = [];
            if (coin.token_standard === "v1") {
                typeArguments.push(coin.asset_type)
            }
            const functionArguments = [
                offer.borrow_obj
            ];
            const response = await signAndSubmitTransaction({
                sender: account.address,
                data: {
                    function: `${ABI_ADDRESS}::nft_lending::${coin.token_standard === "v1" ? "repay_with_coin" : "repay_with_fa"}`,
                    typeArguments,
                    functionArguments
                },
            });
            await aptos.waitForTransaction({
                transactionHash: response.hash
            })
            const res = await fetch(`/api/lend/repay/${offer._id}`, {
                method: "PUT",
                headers: {
                    contentType: "application/json"
                },
                body: JSON.stringify({ address: account.address })
            });
            const apiRes = await res.json();
            if (!res.ok) {
                throw new Error(apiRes.message)
            }
            toast.success("Loan repayed")
        } catch (error) {
            let errorMessage = typeof error === "string" ? error : `An unexpected error has occured`;
            if (error instanceof Error) {
                errorMessage = error.message;
            }
            toast.error(errorMessage)
        } finally {

        }
    }

    useEffect(() => {
        getLoans();
    }, [getLoans])
    if (loading) return <Loading />
    return (
        <>
            {/* Live/Current loans */}
            <h4 className="loans-title">Current Loans</h4>
            <table className="table mt-3">
                <thead>
                    <tr>
                        <th>Asset</th>
                        <th>Lender</th>
                        <th>Interest</th>
                        <th>APR</th>
                        <th>Duration</th>
                        <th>Loan Value</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        activeLoans.map((item) => (
                            <tr key={`borrowed -${item._id}`}>
                                <td>
                                    <Image src={item.forListing.token_icon} className="rounded me-2" alt={item.forListing.token_name} width={37} height={37} />
                                    <span>{item.forListing.token_name}</span>
                                </td>
                                <td>
                                    <Link href={`https://explorer.aptoslabs.com/account/${item.address}?network=${NETWORK}`} target="_blank">
                                        {shortenAddress(item.address)}
                                    </Link>
                                </td>
                                <td>{interestPercentage(item.apr, item.duration)}%</td>
                                <td>{item.apr} %</td>
                                <td>{item.duration} day/days</td>
                                <td>{item.amount} {getAssetByType(item.coin)?.symbol}</td>
                                <td><button className="action-btn" onClick={()=>onRepayLoan(item)}>Repay Loan</button></td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>


            {/* Previous Loans */}
            <h4 className="mt-5 loans-title">Previous Loans</h4>
            <table className="table mt-3">
                <thead>
                    <tr>
                        <th>Asset</th>
                        <th>Lender</th>
                        <th>Interest</th>
                        <th>APR</th>
                        <th>Duration</th>
                        <th>Loan Value</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        prevLoans.map((item) => (
                            <tr key={`borrowed -${item._id}`}>
                                <td>
                                    <Image src={item.forListing.token_icon} className="rounded me-2" alt={item.forListing.token_name} width={37} height={37} />
                                    <span>{item.forListing.token_name}</span>
                                </td>
                                <td>
                                    <Link href={`https://explorer.aptoslabs.com/account/${item.address}?network=${NETWORK}`} target="_blank">
                                        {shortenAddress(item.address)}
                                    </Link>
                                </td>
                                <td>{interestPercentage(item.apr, item.duration)}%</td>
                                <td>{item.apr} %</td>
                                <td>{item.duration} day/days</td>
                                <td>{item.amount} {getAssetByType(item.coin)?.symbol}</td>
                                <td>{item.status}</td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </>
    )
}