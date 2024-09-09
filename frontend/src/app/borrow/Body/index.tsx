"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { getUserOwnedCollections, getUserOwnedTokensByCollection } from "@/utils/aptos";
import { Collection } from "@/types/Collection";
import Image from "next/image";
import { Token } from "@/types/Token";
import Link from "next/link";

export function Body() {
    const [userOwnedCollections, setUserOwnedCollections] = useState<Collection[]>([]);
    const [collectionId, setCollectionId] = useState<string | null>(null)
    const { account } = useWallet();
    const getCollectionsOwnedByUser = useCallback(async() => {
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
    return (
        <section className="banner">
            <div className="container">
                <div className="row">
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
                    <OwnedTokens collectionId={collectionId} />
                </div>
            </div>
        </section>
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
                for(const token of res){
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
        tokens.map((token) => (
            <div className="card" style={{ width: "18rem" }} key={token.token_data_id}>
                <Image src={token.token_icon_uri ?? "/nfts/1.jpeg"} className="card-img-top" alt="..." width={50} height={200}/>
                <div className="card-body">
                    <h5 className="card-title">{token.token_name}</h5>
                    <p className="card-text"></p>
                    <Link href={`/borrow/${collectionId}/${token.token_data_id}`} className="btn btn-primary">Go somewhere</Link>
                </div>
            </div>
        ))
    )
}