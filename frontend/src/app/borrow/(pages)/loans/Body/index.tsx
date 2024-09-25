"use client"
import { Loan } from "@/types/ApiInterface";
import { useWallet } from "@aptos-labs/wallet-adapter-react"
import { useCallback, useEffect, useState } from "react";
import { useApp } from "@/context/AppProvider";
import { shortenAddress } from "@/utils/shortenAddress";
import Image from "next/image";
import Link from "next/link";
import { NETWORK } from "@/utils/env";
import { interestPercentage } from "@/utils/math";
import { Clock } from "@/components/Clock";
import { secInADay } from "@/utils/time";
import { RepayModal, repayModalId } from "../RepayModal";
import millify from "millify";
import { IoNewspaperOutline } from "react-icons/io5";
import { useKeylessAccounts } from "@/core/useKeylessAccounts";
export function Body() {
    const { activeAccount } = useKeylessAccounts();
    const { account } = useWallet();
    const { getAssetByType } = useApp();
    const [loading, setLoading] = useState(true);
    const [activeLoans, setActiveLoans] = useState<Loan[]>([]);
    const [prevLoans, setPrevLoans] = useState<Loan[]>([])
    const [repayOffer, setRepayOffer] = useState<Loan | null>(null)
    const getLoans = useCallback(async () => {
        if (!account?.address && activeAccount) return;
        setLoading(true)
        try {
            const address = activeAccount ? activeAccount?.accountAddress?.toString() : account?.address;
            if(!address){
                throw new Error("Address not found")
            }
            const res = await fetch(`/api/lend?forAddress=${address}&status=borrowed`);
            const response = await res.json();
            if (res.ok) {
                setActiveLoans(response.data)
            }
            const prevRes = await fetch(`/api/lend/previous?forAddress=${address}`);
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
        getLoans();
    }, [getLoans])
    // if (loading) return <Loading />
    return (
        <>
            {/* Live/Current loans */}
            <h4 className="loans-title">Current Loans</h4>
            <div className="overflow-auto">
                <table className="table mt-3 loans-table">
                    <thead>
                        <tr>
                            <th>Asset</th>
                            <th>Lender</th>
                            <th>Interest</th>
                            <th>APR</th>
                            <th>Duration</th>
                            <th>Countdown</th>
                            <th>Loan</th>
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
                                        <td className="text-center"><span className="line"></span></td>
                                        <td className="text-center"><span className="line"></span></td>
                                        <td className="text-end"><span className="line"></span></td>
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
                                                <Link href={`https://explorer.aptoslabs.com/account/${item.address}?network=${NETWORK}`} target="_blank">
                                                    {shortenAddress(item.address)}
                                                </Link>
                                            </td>
                                            <td>{millify(interestPercentage(item.apr, item.duration))}%</td>
                                            <td>{item.apr} %</td>
                                            <td>{item.duration} day/days</td>
                                            <td>{item.start_timestamp ? <Clock timestamp={item.start_timestamp + item.duration * secInADay} /> : ""}</td>
                                            <td>{item.amount} {getAssetByType(item.coin)?.symbol}</td>
                                            <td className="text-end"><button className="action-btn" onClick={() => setRepayOffer(item)} data-bs-toggle="modal" data-bs-target={`#${repayModalId}`}>Repay Loan</button></td>
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


            {
                prevLoans.length > 0
                &&
                <>
                    <h4 className="mt-5 loans-title">Previous Loans</h4>
                    <div className="overflow-auto">
                        <table className="table mt-3 loans-table">
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
                                            <td>{millify(interestPercentage(item.apr, item.duration))}%</td>
                                            <td>{item.apr} %</td>
                                            <td>{item.duration} day/days</td>
                                            <td>{item.amount} {getAssetByType(item.coin)?.symbol}</td>
                                            <td className="text-capitalize">{item.status}</td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    </div>
                </>
            }

            <RepayModal offer={repayOffer} getLoans={getLoans}/>
        </>
    )
}