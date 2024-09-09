"use client"
import { Token } from "@/types/Token";
import { getUserOwnedTokensByCollection } from "@/utils/aptos";
import { useWallet } from "@aptos-labs/wallet-adapter-react"
import { useFormik } from "formik";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { useApp } from "@/context/AppProvider";
interface BodyProps {
    collectionId: string;
    tokenDataId: string;
}
export function Body({ collectionId, tokenDataId }: BodyProps) {
    const { assets } = useApp();
    const { account } = useWallet();
    const [token, setToken] = useState<Token | null>(null)
    const getOwnedTokensByCollection = useCallback(() => {
        if (!account?.address || !collectionId) {
            return setToken(null)
        }
        try {
            getUserOwnedTokensByCollection(account.address, collectionId).then((res) => {
                const slugToken = res.filter(tokenData => tokenData.token_data_id === tokenDataId)[0] ?? null;
                if (slugToken) {
                    setToken({
                        token_data_id: slugToken.token_data_id,
                        token_icon_uri: slugToken.current_token_data?.token_uri,
                        token_name: slugToken.current_token_data?.token_name,
                    })
                }
            })
        } catch (error) {
            console.error(error)
        }
    }, [account?.address, collectionId, tokenDataId])

    const { values, handleSubmit, handleChange } = useFormik({
        initialValues: {
            fa_metadata: "",
            amount: "",
            duration: "",
            apr: ""
        },
        onSubmit: async (data) => {
            if (!account?.address || !token) return;
            const formData = {
                ...data,
                account_address: account.address,
                collection_id: collectionId,
                token_data_id: tokenDataId,
                token_icon: token.token_icon_uri,
                token_name: token.token_name,
                // override metadata
                fa_metadata: data.fa_metadata !== "" ? data.fa_metadata : null,
            }
            fetch("/api/listing", {
                method: "POST", headers: {
                    contentType: "application/json"
                }, body: JSON.stringify(formData)
            }).then((res) => {
                if (!res.ok) {
                    return res.json().then((error) => {
                        throw new Error(error.message)
                    })
                }
                return res.json()
            }).then(() => {
                toast.success("Item listed")
            }).catch((error) => {
                toast.error(error.message)
            })
        }
    })
    useEffect(() => {
        getOwnedTokensByCollection()
    }, [getOwnedTokensByCollection]);
    if (!token) return null;
    return (
        <section className="banner">
            <div className="container">
                <div className="row">
                    <div className="col-md-6">
                        <div className="card" style={{ width: "18rem" }} key={token.token_data_id}>
                            <Image src={token.token_icon_uri ?? "/nfts/1.jpeg"} className="card-img-top" alt="..." width={50} height={200} />
                            <div className="card-body">
                                <h5 className="card-title">{token.token_name}</h5>
                                <p className="card-text"></p>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <form className="p-3 border" onSubmit={handleSubmit}>
                            <label>Select token</label>
                            <select className="form-select" name="fa_metadata" value={values.fa_metadata} onChange={handleChange}>
                                <option value=""></option>
                                {
                                    assets.map(fa => (
                                        <option value={fa.asset_type} key={fa.asset_type}>{fa.symbol}</option>
                                    ))
                                }
                            </select>
                            <input type="text" name="amount" value={values.amount} onChange={handleChange} placeholder="Enter Amount" />
                            <label>Select lock duration</label>
                            <select className="form-select" name="duration" value={values.duration} onChange={handleChange}>
                                <option value="1">1 days</option>
                                <option value="2">2 days</option>
                            </select>
                            <input type="text" name="apr" value={values.apr} onChange={handleChange} />
                            <input type="submit" />
                        </form>
                    </div>
                </div>
            </div>
        </section >
    )
}