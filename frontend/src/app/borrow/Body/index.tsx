"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { getUserOwnedCollections, getUserOwnedTokensByCollection } from "@/utils/aptos";
import { Collection } from "@/types/Collection";
import Image from "next/image";
import { Token } from "@/types/Token";
import Link from "next/link";
import { IoIosArrowDown } from "react-icons/io";

// Import Swiper React components
// import { Swiper, SwiperSlide } from 'swiper/react';
// import 'swiper/css';
// import { EffectCards } from 'swiper/modules';

export function Body() {
    const [userOwnedCollections, setUserOwnedCollections] = useState<Collection[]>([]);
    // const [collectionId, setCollectionId] = useState<string | null>(null)
    const [collectionId, setCollectionId] = useState('')
    const { account } = useWallet();
    const getCollectionsOwnedByUser = useCallback(async () => {
        if (!account?.address) return;
        try {
            getUserOwnedCollections(account.address).then((res) => {
                const ownedCollections: Collection[] = [];
                for (const collection of res) {
                    ownedCollections.push({
                        collection_id: collection.collection_id,
                        collection_name: collection.collection_name,
                        collection_uri: collection.collection_uri,
                        token_standard: collection.current_collection?.token_standard,
                    })
                }
                setUserOwnedCollections(ownedCollections);
            });
        } catch (error) {
            console.error(error)
        }
    }, [account?.address])
    useEffect(() => {
        getCollectionsOwnedByUser()
    }, [getCollectionsOwnedByUser])

    const repeater = 8;
    const [dropdown, setDropdown] = useState(true)
    const handleCollectionSelect = (collection: any) => {
        if (collection.collection_id) {
            setCollectionId(collection.collection_id);
        }
        setDropdown(!dropdown); // Close the dropdown after selection
    };
    return (
        <>
            <section className="inner-banner">
                <div className="container">
                    <div className="row">
                        <div className="col text-center">
                            <h2>Unlock Crypto Loans with Your NFTs</h2>
                            <p className="w-50 m-auto position-relative pt-3">Leverage your NFTs as collateral and access instant liquidity without selling your digital assets. Get quick, transparent loans today!</p>
                        </div>
                        {/* <div className="col">
                            <Swiper effect={'cards'} grabCursor={true} modules={[EffectCards]} className="nfts" >
                                {Array.from({ length: repeater }).map((_, index) => (
                                    <SwiperSlide>
                                        <Image src={`/media/nfts/${index + 1}.jpeg`} alt="nft" height={100} width={100} />
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        </div> */}
                    </div>
                </div>
            </section>

            <section className="borrow-tabs py-100">
                <div className="container">
                    <div className="row">
                        <div className="col">
                            <div className="d-flex">
                                <div className="nav flex-column nav-pills me-4 tab-btns" id="v-pills-tab" role="tablist" aria-orientation="vertical">
                                    <button className="active tab-btn" id="assets-tab" data-bs-toggle="pill" data-bs-target="#assets" type="button" role="tab" aria-controls="assets" aria-selected="true">My Assets</button>

                                    <button className="tab-btn" id="getloan-tab" data-bs-toggle="pill" data-bs-target="#getloan" type="button" role="tab" aria-controls="getloan" aria-selected="false">Get Loan</button>

                                    <button className="tab-btn" id="offers-tab" data-bs-toggle="pill" data-bs-target="#offers" type="button" role="tab" aria-controls="offers" aria-selected="false">My Offers</button>
                                </div>
                                <div className="tab-content rounded" id="v-pills-tabContent">
                                    <div className="tab-pane fade show active" id="assets" role="tabpanel" aria-labelledby="assets-tab">
                                        <div className="content-header d-flex">
                                            <div className="collection">
                                                <div className="dropdown-btn">
                                                    <button className="rounded text-start" onClick={() => setDropdown(!dropdown)}>Select Collection <IoIosArrowDown /></button>
                                                </div>
                                                <div className="coll-dropdown rounded" hidden={dropdown}>
                                                    {userOwnedCollections.map((collection, index) => (
                                                        <div className="coll-item" key={index} onClick={() => handleCollectionSelect(collection)}>
                                                            <p>{collection.collection_name} ({collection.token_standard})</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="view-type">
                                                <p>list/grid</p>
                                            </div>
                                        </div>
                                        <div className="content-body">
                                            <OwnedTokens collectionId={collectionId} />
                                        </div>
                                    </div>
                                    <div className="tab-pane fade" id="getloan" role="tabpanel" aria-labelledby="getloan-tab">
                                        <p>Get a loan</p>
                                    </div>
                                    <div className="tab-pane fade" id="offers" role="tabpanel" aria-labelledby="offers-tab">
                                        <p>My offers</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* <section className="borrow py-100">
                <div className="container">
                    <div className="row">
                        <div className="col-2">
                            <div className="btn-group" role="group" aria-label="Basic radio toggle button group">
                                {
                                    userOwnedCollections.map((collection, index) => (
                                        <React.Fragment key={index}>
                                            <input type="radio" name="btnradio" id="btnradio1" autoComplete="off" checked={collectionId === collection.collection_id} onChange={() => {
                                                if (collection.collection_id) {
                                                    setCollectionId(collection.collection_id);
                                                }
                                            }} />
                                            <label className="btn btn-outline-primary" htmlFor="btnradio1">
                                                {collection.collection_name} ({collection.token_standard})
                                                <Image alt={collection.collection_name ?? "collection_icon"} src={collection.collection_uri ?? "/nfts/1.jpeg"} height={50} width={50} />
                                            </label>
                                        </React.Fragment>
                                    ))
                                }
                            </div>
                        </div>
                        <div className="col-10">
                            <OwnedTokens collectionId={collectionId} />
                        </div>
                    </div>
                </div>
            </section> */}
        </>
    )
}

function OwnedTokens({ collectionId }: { collectionId: string | null }) {
    const { account } = useWallet()
    const [tokens, setTokens] = useState<Token[]>([])
    const getOwnedTokensByCollection = useCallback(() => {
        if (!account?.address || !collectionId) {
            return setTokens([])
        }
        try {
            getUserOwnedTokensByCollection(account.address, collectionId).then((res) => {
                const ownedTokens: Token[] = [];
                for (const token of res) {
                    ownedTokens.push({
                        token_data_id: token.token_data_id,
                        token_icon_uri: token.current_token_data?.token_uri,
                        token_name: token.current_token_data?.token_name
                    })
                }
                setTokens(ownedTokens)
            })
        } catch (error) {
            console.error(error)
        }
    }, [account?.address, collectionId])
    useEffect(() => {
        getOwnedTokensByCollection()
    }, [getOwnedTokensByCollection])
    return (
        <>
            <div className="all-cards pt-4 d-flex gap-3 flex-4">
                {
                    tokens.map((token, index) => (
                        <div className="card w-25" key={token.token_data_id}>
                            {/* <Image src={token.token_icon_uri ?? "/media/nfts/1.jpeg"} className="card-img-top" alt="..." width={50} height={200} /> */}
                            <Image src={`/media/nfts/${index + 1}.jpeg`} className="card-img-top w-100" alt="..." width={250} height={250} />
                            <div className="card-body">
                                <h4 className="card-title">{token.token_name}</h4>
                                <p className="card-text">Lorem ipsum, dolor sit amet consectetur adipisicing elit. Magnam, modi?</p>
                                <Link href={`/borrow/${collectionId}/${token.token_data_id}`} className="btn connect-btn w-100 mt-3">List NFT</Link>
                            </div>
                        </div>
                    ))
                }
            </div>
        </>
    )
}