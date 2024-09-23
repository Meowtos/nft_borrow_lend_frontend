"use client"
import { IListingSchema } from "@/models/listing"
import Image from "next/image"
import React, { useEffect, useMemo, useState } from "react"
import { BsFillGridFill, BsList } from "react-icons/bs"
import { LendModal, lendModalId } from "../LendModal"
import { useApp } from "@/context/AppProvider"
import { Listing } from "@/types/ApiInterface"
import { useWallet } from "@aptos-labs/wallet-adapter-react"
export function Body() {
    const { account } = useWallet();
    const [view, setView] = useState("grid");
    const [tokensListing, setTokensListing] = useState<Listing[]>([])
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        async function getTokensListing() {
            try {
                const res = await fetch(`/api/listing?status=open`);
                if (res.ok) {
                    const response = await res.json();
                    setTokensListing(response.data)
                }
            } catch (error) {
                console.error(error)
            } finally {
                setLoading(false)
            }
        }
        getTokensListing()
    }, [setTokensListing]);
    const notMyListings = useMemo(() => {
        if (!account?.address) return tokensListing;
        return tokensListing.filter((token) => token.address !== account.address)
    }, [tokensListing, account?.address])
    return (
        <React.Fragment>
            <div className="content-header d-flex">
                <div className="view-type d-flex align-items-center">
                    <span className="me-2">View:</span>
                    <div className="dsp-layout">
                        <BsFillGridFill className={`layout-icon me-1 ${view == 'grid' ? 'active' : ''}`} onClick={() => setView('grid')} />
                        <BsList className={`layout-icon me-1 ${view == 'list' ? 'active' : ''}`} onClick={() => setView('list')} />
                    </div>
                </div>
            </div>
            <div className="content-body">
                <TokenListings viewtype={view} tokens={notMyListings} loading={loading} />
            </div>
        </React.Fragment>
    )
}
interface TokenListingsProps {
    viewtype: string;
    tokens: IListingSchema[];
    loading: boolean;
}
export function TokenListings({ viewtype, tokens, loading }: TokenListingsProps) {
    const { getAssetByType } = useApp();
    const [chosenToken, setChosenToken] = useState<IListingSchema | null>(null);

    return (
        <React.Fragment>
            <div className="all-cards pt-4 grid-view" hidden={viewtype == 'grid' ? false : true}>
                {
                    loading ?
                        Array.from({ length: 6 }).map((_, index) => (
                            <div className="card border-0" key={index}>
                                <span className="line p-5 w-100 mt-0"></span>
                                <div className="card-body pb-4">
                                    <p className="px-3 pt-3"><span className="line"></span></p>
                                    <p className="px-3 pt-3"><span className="line w-100"></span></p>
                                    <p className="px-3 pt-3"><span className="line w-75"></span></p>
                                    <p className="px-3 pt-3"><span className="line w-100"></span></p>
                                </div>
                            </div>
                        ))
                        :
                        tokens.length > 0 ? (
                            tokens.map((token) => (
                                <div className="card border-0" key={token.token_data_id}>
                                    <Image src={`${token.token_icon}`} className="card-img-top w-100" alt={token.token_name} width={150} height={150} />
                                    <div className="card-body ">
                                        <h4 className="card-title">{token.token_name}</h4>
                                        <p className="card-text p-2">{token.collection_name}</p>
                                        <button onClick={() => setChosenToken(token)} data-bs-toggle="modal" data-bs-target={`#${lendModalId}`} className="btn list-btn w-100 mt-3">Lend</button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <>
                                <p className="p-3 w-100 text-center">No Borrowers available</p>
                            </>
                        )
                }
            </div>

            {/* List View */}
            <div className="pt-4 list-view lend" hidden={viewtype == 'list' ? false : true}>
                <table className="table">
                    <thead>
                        <tr>
                            <th>Token Name</th>
                            <th>Token Standard</th>
                            <th>Collection</th>
                            <th>Amount</th>
                            <th>Duration in days</th>
                            <th>APR %</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            loading ?
                                Array.from({ length: 5 }).map((_, index) => (
                                    <tr key={index}>
                                        <td className="text-center"><span className="line"></span></td>
                                        <td className="text-center"><span className="line"></span></td>
                                        <td className="text-center"><span className="line"></span></td>
                                        <td className="text-center"><span className="line"></span></td>
                                        <td className="text-end"><span className="line"></span></td>
                                    </tr>
                                ))
                                :
                                tokens.length > 0 ? (
                                    tokens.map((token) => (
                                        <tr key={token.token_data_id}>
                                            <td>
                                                <Image src={`${token.token_icon}`} className="rounded me-2" alt="nft" width={32} height={32} />
                                                <span className="fs-5">{token.token_name} </span>
                                                <span className="d-none ts-mobile">(V2)</span><br />
                                                <p className="d-none ts-mobile pt-2">{token.collection_name}</p><br />
                                                <p className="d-none ts-mobile">{token.apr}%</p>
                                            </td>
                                            <td>{token.token_standard}</td>
                                            <td>{token.collection_name}</td>
                                            <td>{token.amount} {token.coin ? getAssetByType(token.coin)?.symbol : ""}</td>
                                            <td>{token.duration}</td>
                                            <td>{token.apr}</td>
                                            <td>
                                                <button onClick={() => setChosenToken(token)} className="action-btn rounded" data-bs-toggle="modal" data-bs-target={`#${lendModalId}`}>Lend</button>
                                                <p className="d-none ts-mobile pt-2">{token.amount} {token.coin ? getAssetByType(token.coin)?.symbol : ""}</p><br />
                                                <p className="d-none ts-mobile">{token.duration}D</p>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="text-center"><p className="p-3">No Borrowers available</p></td>
                                    </tr>
                                )
                        }
                    </tbody>
                </table>
            </div>
            <LendModal token={chosenToken} />
        </React.Fragment>
    )
}