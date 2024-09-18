"use client"
import React, { useState } from "react"
import { FA, COIN } from "@/utils/coins"
import { toast } from "sonner";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { ABI_ADDRESS } from "@/utils/env";
import { aptos } from "@/utils/aptos";
import { explorerUrl } from "@/utils/constants";
export function Body() {
    const { account, signAndSubmitTransaction } = useWallet();
    const [coin, setCoin] = useState(FA);
    const [loading, setLoading] = useState(false);
    const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            if(!account?.address) return;
            setLoading(true);
            if(coin === COIN){
                const response = await signAndSubmitTransaction({
                    sender: account.address,
                    data: {
                        function: `${ABI_ADDRESS}::coin::faucet`,
                        typeArguments: [],
                        functionArguments: []
                    }
                });
                await aptos.waitForTransaction({
                    transactionHash: response.hash
                });
                toast.success("Transaction succeedd", {
                    action: <a href={`${explorerUrl}/txn/${response.hash}`}>View Txn</a>
                })
            }
            if(coin === FA){
                const response = await signAndSubmitTransaction({
                    sender: account.address,
                    data: {
                        function: `${ABI_ADDRESS}::fa::faucet`,
                        typeArguments: [],
                        functionArguments: []
                    }
                });
                await aptos.waitForTransaction({
                    transactionHash: response.hash
                });
                toast.success("Transaction succeedd", {
                    action: <a href={`${explorerUrl}/txn/${response.hash}`}>View Txn</a>
                })
            }
        } catch (error) {
            let errorMessage = typeof error === "string" ? error : `An unexpected error has occured`;
            if (error instanceof Error) {
                errorMessage = error.message;
            }
            toast.error(errorMessage)
        } finally {
            setLoading(false);
        }
    }
    return (
        <section className="inner-banner">
            <div className="container mt-5">
                <div className="row justify-content-center">
                    <div className="col-lg-6 col-md-8">
                        <div className="card shadow-lg p-4">
                            <h3 className="text-center mb-4 text-white">Faucet Request</h3>
                            <h3 className="text-center mb-4 text-white">Some description</h3>
                            <form onSubmit={onSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="coin" className="form-label">Select coin</label>
                                    <select className="form-select" name="coin" value={coin} onChange={(e)=>setCoin(e.target.value)} required >
                                        <option value={FA}>MEOW</option>
                                        <option value={COIN}>SIMPU COIN</option>
                                    </select>
                                </div>
                                <div className="d-grid gap-2">
                                    {
                                        loading
                                            ?
                                            <button type="button" className="btn btn-primary" disabled>Loading</button>
                                            :
                                            <button type="submit" className="btn btn-primary">Request Token</button>

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