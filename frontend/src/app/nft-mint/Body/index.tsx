"use client"
import { useState } from "react"
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { ABI_ADDRESS, NETWORK } from "@/utils/env";
import { aptos } from "@/utils/aptos";
import { toast } from "sonner";
import { explorerUrl } from "@/utils/constants";
import { IoCheckmark } from "react-icons/io5";
import { useTheme } from "@/context/themecontext";
export function Body() {
    const { account, signAndSubmitTransaction, network } = useWallet()
    const [name, setName] = useState("");
    const [uri, setUri] = useState("");
    const [loading, setLoading] = useState(false);
    const { theme } = useTheme();
    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!account?.address) return;
        try {
            setLoading(true);
            if (network?.name !== NETWORK) {
                throw new Error(`Switch to ${NETWORK} network`)
            }
            const response = await signAndSubmitTransaction({
                sender: account.address,
                data: {
                    function: `${ABI_ADDRESS}::cars_collection::mint`,
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
        <section className={`inner-banner ${theme == 'light' ? 'light-theme' : 'dark-theme'}`}>
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-12 col-lg-6 col-md-8">
                        <div className="card mint faucet">
                            <h3 className="text-center mb-4">Mint Testnet NFT</h3>
                            <p className="text-center mt-3">Mint your NFT easily by connecting your wallet and selecting your preferred options. Your NFT will be created and sent directly to your wallet without any extra steps!</p>
                            <form onSubmit={onSubmit} className="mint-form">
                                {/* <div className="mb-3">
                                    <label htmlFor="token" className="form-label">Select Collection:</label>
                                    <select className="form-select select-coin" name="token" value={token} onChange={(e)=>setToken(e.target.value)} required>
                                        <option value="v2">Cars on Aptos</option>
                                    </select>
                                </div> */}
                                <div className="mb-3">
                                    <label htmlFor="name" className="form-label">Token Name:</label>
                                    <input type="text" className="form-control" name="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter your token name" required />
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