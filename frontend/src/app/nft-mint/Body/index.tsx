"use client"
import { useState } from "react"
import { PendingTransactionResponse, useWallet } from "@aptos-labs/wallet-adapter-react";
import { ABI_ADDRESS, NETWORK } from "@/utils/env";
import { aptos } from "@/utils/aptos";
import { toast } from "sonner";
import { explorerUrl } from "@/utils/constants";
import { IoCheckmark } from "react-icons/io5";
import { useTheme } from "@/context/themecontext";
import { useKeylessAccounts } from "@/core/useKeylessAccounts";
import { InputGenerateTransactionPayloadData } from "@aptos-labs/ts-sdk";
export function Body() {
    const { activeAccount } = useKeylessAccounts()
    const { account, signAndSubmitTransaction, network } = useWallet()
    const [uri, setUri] = useState("");
    const [loading, setLoading] = useState(false);
    const [collection, setCollection] = useState("octos")
    const { theme } = useTheme();
    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!account?.address && !activeAccount) {
            return toast.error("Connect your wallet")
        };
        try {
            setLoading(true);
            if (account?.address && network?.name !== NETWORK) {
                throw new Error(`Switch to ${NETWORK} network`)
            }
            let response: PendingTransactionResponse;
            const data: InputGenerateTransactionPayloadData = {
                function: `${ABI_ADDRESS}::${collection}::mint`,
                typeArguments: [],
                functionArguments: [uri]
            }
            if(activeAccount){
                const transaction =  await aptos.transaction.build.simple({
                    sender: activeAccount.accountAddress,
                    data
                });
                response =  await aptos.signAndSubmitTransaction({ signer: activeAccount, transaction });
            } else {
                response = await signAndSubmitTransaction({
                    sender: account?.address,
                    data 
                })
            }
            await aptos.waitForTransaction({
                transactionHash: response.hash
            });
            toast.success("Transaction succeed", {
                action: <a href={`${explorerUrl}/txn/${response.hash}`}>View Txn</a>,
                icon: <IoCheckmark />
            })
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
        <section className={`inner-banner pg-forms ${theme == 'light' ? 'light-theme' : 'dark-theme'}`}>
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-12 col-lg-6 col-md-8">
                        <div className="card mint faucet">
                            <h3 className="text-center mb-4">Mint Testnet NFT</h3>
                            <p className="text-center mb-3">Mint your NFT easily by connecting your wallet and selecting your preferred options. Your NFT will be created and sent directly to your wallet without any extra steps!</p>
                            <form onSubmit={onSubmit} className="mint-form">
                                <div className="mb-3">
                                    <label htmlFor="token" className="form-label">Select Collection:</label>
                                    <select className="form-select select-coin" name="token" value={collection} onChange={(e)=>setCollection(e.target.value)} required>
                                        <option value="octos">Octos</option>
                                        <option value="octos_movers">Octos Movers</option>
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="uri" className="form-label">Icon Uri:</label>
                                    <input type="text" className="form-control" name="uri" value={uri} onChange={(e) => setUri(e.target.value)} placeholder="Enter your nft image url" required />
                                </div>
                                <div className="text-center">
                                    {
                                        loading
                                            ?
                                            <button type="button" className="btn connect-btn" disabled>Loading...</button>
                                            :
                                            <button type="submit" className="btn connect-btn">Mint</button>
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