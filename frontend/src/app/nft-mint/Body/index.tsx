"use client"

import { useState } from "react"
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { ABI_ADDRESS } from "@/utils/env";
import { aptos } from "@/utils/aptos";
import { toast } from "sonner";
import { explorerUrl } from "@/utils/constants";
import { IoCheckmark } from "react-icons/io5";
export function Body() {
    const { account, signAndSubmitTransaction } = useWallet()
    const [token, setToken] = useState("v2");
    const [name, setName] = useState("");
    const [uri, setUri] = useState("");
    const [loading, setLoading] = useState(false);
    const onSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if(!account?.address) return;
        try {
            setLoading(true);
            if(token === "v2"){
                const response = await signAndSubmitTransaction({
                    sender: account.address,
                    data: {
                        function: `${ABI_ADDRESS}::digital_asset::mint`,
                        typeArguments: [],
                        functionArguments: [name, uri]
                    }
                });
                await aptos.waitForTransaction({
                    transactionHash: response.hash
                });
                toast.success("Transaction succeed", {
                    action: <a href={`${explorerUrl}/txn/${response.hash}`}>View Txn</a>,
                    icon: <IoCheckmark />
                })
            }
        } catch (error) {
            let errorMessage = typeof error === "string" ? error : `An unexpected error has occured`;
            if (error instanceof Error) {
                errorMessage = error.message;
            }
            toast.error(errorMessage)
        } finally {
            setLoading(false)
        }

    }
    return (
        <section className="inner-banner">
            <div className="container mt-5">
                <div className="row justify-content-center">
                    <div className="col-lg-6 col-md-8">
                        <div className="card shadow-lg p-4">
                            <h3 className="text-center mb-4 text-white">NFT mint Request</h3>
                            <form onSubmit={onSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="token" className="form-label">Select Collection Type</label>
                                    <select className="form-select" name="token" value={token} onChange={(e)=>setToken(e.target.value)} required>
                                        <option value="v2">V2</option>
                                        <option value="v1">V1</option>
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="name" className="form-label">Token Name</label>
                                    <input type="text" className="form-control" name="name" value={name} onChange={(e)=>setName(e.target.value)} placeholder="Enter your token name" required />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="uri" className="form-label">Icon uri</label>
                                    <input type="text" className="form-control" name="uri" value={uri} onChange={(e)=>setUri(e.target.value)} placeholder="Enter your icon url" required />
                                </div>
                                <div className="d-grid gap-2">
                                    {
                                        loading 
                                        ?
                                        <button type="button" className="btn btn-primary" disabled>Loading...</button>
                                        :
                                        <button type="submit" className="btn btn-primary">Mint</button>
                                    }
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}