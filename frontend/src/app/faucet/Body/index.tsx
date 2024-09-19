"use client"
import React, { useState } from "react"
import { FA, COIN } from "@/utils/coins"
import { toast } from "sonner";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { ABI_ADDRESS } from "@/utils/env";
import { aptos } from "@/utils/aptos";
import { explorerUrl } from "@/utils/constants";
import { useTheme } from "@/context/themecontext";
export function Body() {
    const { account, signAndSubmitTransaction } = useWallet();
    const [coin, setCoin] = useState(FA);
    const [loading, setLoading] = useState(false);
    const {theme} = useTheme();
    const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            if (!account?.address) return;
            setLoading(true);
            if (coin === COIN) {
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
            if (coin === FA) {
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
        <section className={`inner-banner ${theme == 'light' ? 'light-theme' : 'dark-theme'}`}>
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-12 col-lg-6 col-md-8">
                        <div className="card faucet">
                            <h3 className="text-center">Get Your Test Tokens</h3>
                            <p className="text-center mt-3">Quickly receive test tokens by selecting your desired coin. Tokens will be automatically sent to your connected wallet without needing to enter any additional details.</p>
                            <form onSubmit={onSubmit} className="mt-4">
                                <select className="form-select select-coin" name="coin" value={coin} onChange={(e) => setCoin(e.target.value)} required >
                                    <option value={FA}>MEOW</option>
                                    <option value={COIN}>SIMPU COIN</option>
                                </select>
                                <div className="text-center">
                                    {
                                        loading
                                            ?
                                            <button type="button" className="btn connect-btn mt-4" disabled>Loading</button>
                                            :
                                            <button type="submit" className="btn connect-btn mt-4">Request Token</button>

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