"use client"
import { Loan } from "@/types/ApiInterface";
import { NETWORK } from "@/utils/env";
import { shortenAddress } from "@/utils/shortenAddress";
import { useWallet } from "@aptos-labs/wallet-adapter-react"
import Image from "next/image";
import Link from "next/link";
import React, { useCallback, useEffect, useState } from "react";
import { useApp } from "@/context/AppProvider";
import { interestPercentage } from "@/utils/math";
import { Clock } from "@/components/Clock";
import { secInADay } from "@/utils/time";
import { GrabModal, grabModalId } from "../GrabModal";
import { IoNewspaperOutline } from "react-icons/io5";
import { useKeylessAccounts } from "@/core/useKeylessAccounts";
import millify from "millify";
export function Body() {
    const { getAssetByType } = useApp();
    const { activeAccount } = useKeylessAccounts();
    const { account } = useWallet();
    const [loading, setLoading] = useState(true)
    const [activeLoans, setActiveLoans] = useState<Loan[]>([]);
    const [prevLoans, setPrevLoans] = useState<Loan[]>([])
    const [grabOffer, setGrabOffer] = useState<Loan | null>(null)
    const fetchLoans = useCallback(async () => {
        if (!account?.address && !activeAccount) return;
        try {
            const address = activeAccount ? activeAccount?.accountAddress?.toString() : account?.address;
            if(!address){
                throw new Error("Address not found")
            }
            const res = await fetch(`/api/lend?address=${address}&status=borrowed`);
            const response = await res.json();
            if (res.ok) {
                setActiveLoans(response.data)
            }
            const prevRes = await fetch(`/api/lend/previous?address=${address}`);
            const prevResponse = await prevRes.json();
            if (prevRes.ok) {
                setPrevLoans(prevResponse.data)
            }
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }, [account?.address, activeAccount])
    useEffect(() => {
        fetchLoans()
    }, [fetchLoans]);
    // if (loading) return <Loading />
    return (
        <React.Fragment>
            <h4 className="loans-title">Active Loans</h4>
            <div className="overflow-auto">
                <table className="table mt-3 loans-table">
                    <thead>
                        <tr>
                            <th>Asset</th>
                            <th>Borrower</th>
                            <th>Interest</th>
                            <th>APR</th>
                            <th>Duration(days)</th>
                            <th>Countdown</th>
                            <th>Loan</th>
                            <th>Action</th>
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
                                        <td className="text-center"><span className="line"></span></td>
                                        <td className="text-center"><span className="line"></span></td>
                                        <td className="text-center"><span className="line"></span></td>
                                    </tr>
                                ))
                            ) : (
                                activeLoans.length > 0 ? (
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
                                            <td>{item.start_timestamp ? <Clock timestamp={item.start_timestamp + item.duration * secInADay} /> : ""}</td>
                                            <td>{item.amount} {getAssetByType(item.coin)?.symbol}</td>
                                            <td>
                                                <button className="action-btn" data-bs-toggle="modal" data-bs-target={`#${grabModalId}`} onClick={() => setGrabOffer(item)}>Get NFT</button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={9} className="text-center">
                                            <div className="empty-box text-center py-5 px-3 mt-2 mb-2 rounded">
                                                <IoNewspaperOutline className="fs-1" />
                                                <p className="mt-2 w-100 text-center">No Active Loans</p>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            )
                        }
                    </tbody>
                </table>
            </div>

            <h4 className="mt-5 loans-title">Previous Loans</h4>
            <div className="overflow-auto">
                <table className="table mt-3 loans-table">
                    <thead>
                        <tr>
                            <th>Asset</th>
                            <th>Borrower</th>
                            <th>Interest</th>
                            <th>APR</th>
                            <th>Duration(days)</th>
                            <th>Loan Value</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            loading ? (
                                Array.from({ length: 5 }).map((_, index) => (
                                    <tr key={index}>
                                        <td className="text-center"><span className="line"></span></td>
                                        <td className="text-center"><span className="line"></span></td>
                                        <td className="text-center"><span className="line"></span></td>
                                        <td className="text-center"><span className="line"></span></td>
                                        <td className="text-center"><span className="line"></span></td>
                                        <td className="text-center"><span className="line"></span></td>
                                        <td className="text-center"><span className="line"></span></td>
                                    </tr>
                                ))
                            ) : (
                                prevLoans.length > 0 ? (
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
                                            <td>{millify(interestPercentage(item.apr, item.duration))}%</td>
                                            <td>{item.apr} %</td>
                                            <td>{item.duration} day/days</td>
                                            <td>{item.amount} {getAssetByType(item.coin)?.symbol}</td>
                                            <td>{item.status}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={9} className="text-center">
                                            <div className="empty-box text-center py-5 px-3 mt-2 mb-2 rounded">
                                                <IoNewspaperOutline className="fs-1" />
                                                <p className="mt-2 w-100 text-center">No Previous Loans</p>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            )
                        }
                    </tbody>
                </table>
            </div>
            <GrabModal offer={grabOffer} fetchLoans={fetchLoans}/>
        </React.Fragment>

    )
}