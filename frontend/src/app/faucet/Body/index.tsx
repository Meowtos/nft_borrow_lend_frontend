"use client"
import React, { useState } from "react"
import { punk_coin, moon_coin } from "@/utils/coins"
import { toast } from "sonner";
import { PendingTransactionResponse, useWallet } from "@aptos-labs/wallet-adapter-react";
import { ABI_ADDRESS, NETWORK } from "@/utils/env";
import { aptos } from "@/utils/aptos";
import { explorerUrl } from "@/utils/constants";
import { useTheme } from "@/context/themecontext";
import { IoCheckmark } from "react-icons/io5";
import { useKeylessAccounts } from "@/core/useKeylessAccounts";
import { InputGenerateTransactionPayloadData } from "@aptos-labs/ts-sdk";
export function Body() {
    const { activeAccount } = useKeylessAccounts()
    const { account, signAndSubmitTransaction, network } = useWallet();
    const [coin, setCoin] = useState(punk_coin);
    const [loading, setLoading] = useState(false);
    const { theme } = useTheme();
    const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!account?.address && !activeAccount) {
            return toast.error("Connect your wallet")
        };
        try {
            if(account?.address && network?.name !== NETWORK) {
                throw new Error(`Switch to ${NETWORK} network`)
            }
            setLoading(true);
            if (coin === moon_coin) {
                let response: PendingTransactionResponse;
                const data: InputGenerateTransactionPayloadData = {
                    function: `${ABI_ADDRESS}::moon_coin::faucet`,
                    typeArguments: [],
                    functionArguments: [],
                }
                if(activeAccount){
                    const transaction =  await aptos.transaction.build.simple({
                        sender: activeAccount.accountAddress,
                        data
                    });
                    response =  await aptos.signAndSubmitTransaction({ signer: activeAccount, transaction });
                } else {
                    response =  await signAndSubmitTransaction({
                        sender: account?.address,
                        data
                    });
                }
                await aptos.waitForTransaction({
                    transactionHash: response.hash
                });
                toast.success("Transaction succeedd", {
                    action: <a href={`${explorerUrl}/txn/${response.hash}`}>View Txn</a>
                })
            }
            if (coin === punk_coin) {
                let response: PendingTransactionResponse;
                const data: InputGenerateTransactionPayloadData = {
                    function: `${ABI_ADDRESS}::punk_coin::faucet`,
                    typeArguments: [],
                    functionArguments: []
                }
                if(activeAccount){
                    const transaction =  await aptos.transaction.build.simple({
                        sender: activeAccount.accountAddress,
                        data
                    });
                    response =  await aptos.signAndSubmitTransaction({ signer: activeAccount, transaction });
                } else {
                    response =  await signAndSubmitTransaction({
                        sender: account?.address,
                        data
                    });
                }
                await aptos.waitForTransaction({
                    transactionHash: response.hash
                });
                toast.success("Transaction succeedd", {
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
            setLoading(false);
        }
    }
    return (
        <section className={`inner-banner pg-forms ${theme == 'light' ? 'light-theme' : 'dark-theme'}`}>
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-12 col-lg-6 col-md-8">
                        <div className="card faucet">
                            <h3 className="text-center">Get Your Test Tokens</h3>
                            <p className="text-center mt-3">Quickly receive test tokens by selecting your desired coin. Tokens will be automatically sent to your connected wallet without needing to enter any additional details.</p>
                            <form onSubmit={onSubmit} className="mt-4">
                                <label htmlFor="name" className="form-label">Choose Coin:</label>
                                <select className="form-select select-coin" name="coin" value={coin} onChange={(e) => setCoin(e.target.value)} required >
                                    <option value={punk_coin}>Aptos Punk</option>
                                    <option value={moon_coin}>Moon Coin</option>
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