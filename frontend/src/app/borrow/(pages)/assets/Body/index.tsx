"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { getUserOwnedCollections, getUserOwnedTokensByCollection } from "@/utils/aptos";
import { Collection } from "@/types/Collection";
import Image from "next/image";
import { Token } from "@/types/Token";
import Link from "next/link";
import { IoIosArrowDown } from "react-icons/io";
import { BsList } from "react-icons/bs";
import { BsFillGridFill } from "react-icons/bs";

export function Body() {
    const { account } = useWallet();
    const [userOwnedCollections, setUserOwnedCollections] = useState<Collection[]>([]);
    const [collectionId, setCollectionId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [dropdown, setDropdown] = useState(true);
    const [view, setView] = useState('grid');


    const chosenCollection: Collection | null = useMemo(() => {
        const found = userOwnedCollections.find((collection) => collection.collection_id === collectionId);
        return found ?? null;
    }, [collectionId, userOwnedCollections])
    const getCollectionsOwnedByUser = useCallback(async () => {
        if (!account?.address) {
            return setIsLoading(false)
        };
        setIsLoading(true)
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
                if (ownedCollections.length > 0) {
                    setCollectionId(ownedCollections[0].collection_id ?? null)
                }
            });
        } catch (error) {
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }, [account?.address])
    useEffect(() => {
        getCollectionsOwnedByUser()
    }, [getCollectionsOwnedByUser])

    const handleCollectionSelect = (collection: any) => {
        if (collection.collection_id) {
            setCollectionId(collection.collection_id);
        }
        setDropdown(!dropdown);
    };
    if (isLoading) return "Loading...."
    return (
        <React.Fragment>
            <div className="content-header d-flex">
                <div className="collection">
                    <div className="dropdown-btn">
                        <button className="rounded text-start" onClick={() => setDropdown(!dropdown)}>
                            {
                                chosenCollection ? chosenCollection.collection_name ?? "Select Collection" : "Select Collection"
                            }
                            <IoIosArrowDown /></button>
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
                    <div className="dsp-layout">
                        <BsList className={`layout-icon me-1 ${view == 'list' ? 'active' : ''}`} onClick={() => setView('list')} />
                        <BsFillGridFill className={`layout-icon ${view == 'grid' ? 'active' : ''}`} onClick={() => setView('grid')} />
                    </div>
                </div>
            </div>
            <div className="content-body">
                <OwnedTokens collectionId={collectionId} />
            </div>
        </React.Fragment>
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
            <div className="all-cards pt-4 grid-view">
                {
                    tokens.map((token, index) => (
                        <div className="card" key={token.token_data_id}>
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

            <div className="pt-4 list-view">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>More Info</th>
                            <th className="text-center">Collection</th>
                            <th className="text-end">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            tokens.map((token, index) => (
                                <tr>
                                    <td><Image src={`/media/nfts/${index + 1}.jpeg`} className="rounded me-2" alt="nft" width={40} height={40} /><span className="fs-5">{token.token_name}</span></td>
                                    <td>--</td>
                                    <td className="text-center">collection name</td>
                                    <td className="text-end"><Link href={`/borrow/${collectionId}/${token.token_data_id}`} className="action-btn rounded">List</Link></td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
        </>
    )
}