"use client"
import { Loading } from "@/components/Loading";
import { Loan } from "@/types/ApiInterface";
import { NETWORK } from "@/utils/env";
import { shortenAddress } from "@/utils/shortenAddress";
import { useWallet } from "@aptos-labs/wallet-adapter-react"
import Image from "next/image";
import Link from "next/link";
import React, { useCallback, useEffect, useState } from "react";
import { useApp } from "@/context/AppProvider";
import { interestPercentage } from "@/utils/math";
export function Body() {
    const { getAssetByType } = useApp();
    const { account } = useWallet();
    const [loading, setLoading] = useState(true)
    const [activeLoans, setActiveLoans] = useState<Loan[]>([]);
    const [prevLoans, setPrevLoans] = useState<Loan[]>([])
    const fetchLoans = useCallback(async () => {
        if (!account?.address) return;
        try {
            const res = await fetch(`/api/lend?address=${account.address}&status=borrowed`);
            const response = await res.json();
            if (res.ok) {
                setActiveLoans(response.data)
            }
            const prevRes = await fetch(`/api/lend/previous?address=${account.address}`);
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
    const onSteal = async(offer: Loan) => {
        console.log(offer)
    }
    useEffect(() => {
        fetchLoans()
    }, [fetchLoans]);
    if (loading) return <Loading />
    return (
        <React.Fragment>
            <h4 className="loans-title">Active Loans</h4>
            <table className="table mt-3">
                <thead>
                    <tr>
                        <th>Asset</th>
                        <th>Borrower</th>
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
                                    <Link href={`https://explorer.aptoslabs.com/account/${item.forAddress}?network=${NETWORK}`} target="_blank">
                                        {shortenAddress(item.forAddress)}
                                    </Link>
                                </td>
                                <td>{interestPercentage(item.apr, item.duration)}%</td>
                                <td>{item.apr}%</td>
                                <td>{item.duration} day/days</td>
                                <td>{item.amount} {getAssetByType(item.coin)?.symbol}</td>
                                <td>
                                    <button className="action-btn" onClick={()=>onSteal(item)}>Get NFT</button>
                                </td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
            <h4 className="mt-5 loans-title">Previous Loans</h4>
            <table className="table mt-3">
                <thead>
                    <tr>
                        <th>Asset</th>
                        <th>Borrower</th>
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
                            <tr key={`lend -${item._id}`}>
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
        </React.Fragment>

    )
}