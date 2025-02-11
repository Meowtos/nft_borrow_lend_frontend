"use client";

import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { IoIosArrowDown } from "react-icons/io";
import { BsList } from "react-icons/bs";
import { BsFillGridFill } from "react-icons/bs";
import { assetListingModalId, ListingModal } from "../ListingModal";
import { MdFilter } from "react-icons/md";
import { Listing } from "@/types/ApiInterface";
import { useApp } from "@/context/AppProvider";
import { AptosContract } from "@/libs/aptos";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { MovementContract } from "@/libs/movement";
import { useWallet as useMoveWallet } from "@razorlabs/razorkit";
import { IoNewspaperOutline } from "react-icons/io5";
export type Collection = {
    id: string | null | undefined; 
    name: string | null | undefined; 
    uri: string | null | undefined; 
    description: string;
}
export function Body() {
    const aptosWallet = useWallet();
    const movementWallet = useMoveWallet();
    const { connectedAddress, chain } = useApp()
    const [isLoading, setIsLoading] = useState(true);
    const [dropdown, setDropdown] = useState(true);
    const [view, setView] = useState('grid');
    const [collections, setCollections] = useState<Collection[]>([]);
    const [currentCollection, setCurrentCollection] = useState<Collection | null>(null)

    // const [chosenCollection, setChosenCollection] = useState<Collection | null>(null);
    // const [userListings, setUserListings] = useState<Listing[]>([])
    // const [userListingLoading, setUserListingLoading] = useState(true)
    const getCollectionsOwnedByUser = useCallback(async () => {
        if (!connectedAddress) return;
        setIsLoading(true)
        try {
            let collections: Collection[] = []
            if(chain.name === "aptos") {
                const aptos = new AptosContract(aptosWallet);
                collections = await aptos.getWalletCollections(connectedAddress);
            }
            if(chain.name === "movement") {
                const movement = new MovementContract(movementWallet);
                collections = await movement.getWalletCollections(connectedAddress);
            }
            setCollections(collections);
            if(collections.length > 0){
                setCurrentCollection(collections[0])
            }

        } catch (error) {
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }, [connectedAddress, chain])
    // const getUserListings = useCallback(async () => {
    //     if (!account?.address && !activeAccount) return;
    //     try {
    //         setUserListingLoading(true)
    //         const address = activeAccount ? activeAccount?.accountAddress?.toString() : account?.address;
    //         if (!address) {
    //             throw new Error("Address not found")
    //         }
    //         const res = await fetch(`/api/listing?address=${address}&status=open`);
    //         if (res.ok) {
    //             const response = await res.json();
    //             setUserListings(response.data)
    //         }
    //     } catch (error) {
    //         console.error(error)
    //     } finally {
    //         setUserListingLoading(false)
    //     }
    // }, [account?.address, activeAccount])
    useEffect(() => {
        getCollectionsOwnedByUser()
    }, [getCollectionsOwnedByUser])
    // useEffect(() => {
    //     getUserListings()
    // }, [getUserListings])

    const handleCollectionSelect = (collection: Collection | null) => {
        setCurrentCollection(collection)
        setDropdown(!dropdown); // Close the dropdown after selection
    };

    return (
        <React.Fragment>
            <div className="content-header d-flex mb-4">
                <div className="collection">
                    <div className="dropdown-btn sl-coll">
                        <span className="me-2 fs-6">Select Collection:</span>
                        {
                            !isLoading
                            &&
                            <button className="rounded text-start coll-btn" onClick={() => setDropdown(!dropdown)}>
                                {
                                    currentCollection ? currentCollection.name : "None"
                                }
                                <IoIosArrowDown className="dd-icon" /></button>
                        }

                    </div>
                    <MdFilter className="mb-coll-filter d-none rounded" onClick={() => setDropdown(!dropdown)} />

                    <div className="coll-dropdown cl-1 rounded" hidden={dropdown}>
                        {collections.map((collection, index) => (
                            <div className="coll-item" key={index} onClick={() => handleCollectionSelect(collection)}>
                                <p>{collection.name}</p>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="view-type d-flex align-items-center">
                    <span className="me-2">View:</span>
                    <div className="dsp-layout">
                        <BsFillGridFill className={`layout-icon me-1 ${view == 'grid' ? 'active' : ''}`} onClick={() => setView('grid')} />
                        <BsList className={`layout-icon me-1 ${view == 'list' ? 'active' : ''}`} onClick={() => setView('list')} />
                    </div>
                </div>
            </div>
            <div className="content-body">
                <OwnedTokens viewtype={view} collection={currentCollection} />
            </div>
        </React.Fragment>
    )
}

type OwnedTokensProps = {
    collection: Collection | null;
    viewtype: string;
};

export type Token = {
    id: string; 
    name: string; 
    uri: string | undefined; 
    description: string | undefined; 
    properties: any;
}
function OwnedTokens({ collection, viewtype }: OwnedTokensProps) {
    const aptosWallet = useWallet();
    const movementWallet = useMoveWallet();
    const { chain, connectedAddress } = useApp()
    const [tokens, setTokens] = useState<Token[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [listingToken, setListingToken] = useState<Token | null>(null)
    const getOwnedTokensByCollection = useCallback(async () => {
        if ((!connectedAddress) || !collection || !collection.id) {
            return setTokens([])
        }
        try {
            let resTokens: Token[] = []
            if(chain.name === "aptos") {
                const aptos = new AptosContract(aptosWallet);
                resTokens = await aptos.getNFTByCollection(collection.id, connectedAddress)
            }
            if(chain.name === "movement") {
                const movement = new MovementContract(movementWallet);
                resTokens = await movement.getNFTByCollection(collection.id, connectedAddress)
            }
            setTokens(resTokens)
        } catch (error) {
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }, [collection, connectedAddress, chain])
    // const onUpdateListing = (token: Token) => {
    //     const exists = userListings.find((item) => item.token_data_id === token.token_data_id);
    //     if (exists) {
    //         setUpdateListing(exists)
    //     }
    // }
    useEffect(() => {
        getOwnedTokensByCollection()
    }, [getOwnedTokensByCollection]);
    return (
        <React.Fragment>
            {tokens.length === 0 && (
                <>
                    <div className="empty-box text-center py-5 px-3 rounded">
                        <IoNewspaperOutline className="fs-1" />
                        <p className="mt-2 w-100 text-center">No Assets Found</p>
                    </div>
                </>
            )}
            {tokens.length > 0 && (
            <div className="all-cards grid-view" hidden={viewtype == 'grid' ? false : true}>
                {
                    isLoading ?
                        Array.from({ length: 5 }).map((_, index) => (
                            <div className="card border-0" key={index}>
                                <span className="line p-5 w-100 mt-0"></span>
                                <div className="card-body pb-4">
                                    <p className="px-3 pt-3"><span className="line"></span></p>
                                    <p className="px-3 pt-3"><span className="line w-100"></span></p>
                                    <p className="px-3 pt-3"><span className="line w-75"></span></p>
                                    <p className="px-3 pt-3"><span className="line w-100 ms-auto"></span></p>
                                </div>
                            </div>
                        ))
                        :
                        tokens.map((token) => (
                            <div className="card border-0 text-light" key={token.id}>
                                <Image src={`${token.uri}`} className="card-img-top w-100" alt={token.name} width={150} height={230} />
                                <div className="card-body">
                                    <h4 className="card-title">{token.name}</h4>
                                    <p className="d-flex">Collection: <span>{collection?.name}</span></p>
                                    {/* {
                                        userListings.some(item => item.token_data_id === token.token_data_id)
                                            ?
                                            <button onClick={() => onUpdateListing(token)} data-bs-toggle="modal" data-bs-target={`#${updateListingModalId}`} className="btn list-btn w-100">Update Listing</button>
                                            :
                                    } */}
                                    <button onClick={() => setListingToken(token)} data-bs-toggle="modal" data-bs-target={`#${assetListingModalId}`} className="btn list-btn w-100">List Asset</button>
                                </div>
                            </div>
                        ))
                }
            </div>
            )}

            {/* List View */}
            {tokens.length > 0 && (
            <div className="list-view" hidden={viewtype == 'list' ? false : true}>
                <table className="table">
                    {tokens.length > 0 && (
                        <thead>
                            <tr>
                                <th>Token Name</th>
                                <th>Token Description</th>
                                <th className="text-center">Token Standard</th>
                                <th>Collection</th>
                                <th className="text-end">Action</th>
                            </tr>
                        </thead>
                    )}
                    <tbody>
                        {
                            isLoading ? (
                                Array.from({ length: 5 }).map((_, index) => (
                                    <tr key={index}>
                                        <td className="text-center"><span className="line"></span></td>
                                        <td className="text-center"><span className="line"></span></td>
                                        <td className="text-center"><span className="line"></span></td>
                                        <td className="text-center"><span className="line"></span></td>
                                        <td className="text-end"><span className="line"></span></td>
                                    </tr>
                                ))
                            ) :
                                tokens.map((token, index) => (
                                    <tr key={index}>
                                        <td>
                                            <Image src={`${token.uri}`} className="rounded me-2" alt="nft" width={32} height={32} />
                                            <span className="fs-5">{token.name} </span>
                                            {/* <span className="d-none ts-mobile"> ({token.token_standard})</span> */}
                                        </td>
                                        <td>{token.description}</td>
                                        <td className="text-center">{JSON.stringify(token.properties)}</td>
                                        <td>{collection?.name}</td>
                                        <td className="text-end">
                                            {/* {
                                                userListings.some(item => item.token_data_id === token.token_data_id)
                                                    ?
                                                    <button onClick={() => onUpdateListing(token)} className="action-btn rounded" data-bs-toggle="modal" data-bs-target={`#${updateListingModalId}`}>Update</button>
                                                    :
                                                    } */}
                                                <button onClick={() => setListingToken(token)} className="action-btn rounded" data-bs-toggle="modal" data-bs-target={`#${assetListingModalId}`}>List</button>
                                        </td>
                                    </tr>
                                ))
                        }
                    </tbody>
                </table>
            </div>
            )}
             <ListingModal token={listingToken} collection={collection}/> 
            {/* <UpdateListingModal token={updateListing} getUserListings={getUserListings} />  */}
        </React.Fragment>
    )
}