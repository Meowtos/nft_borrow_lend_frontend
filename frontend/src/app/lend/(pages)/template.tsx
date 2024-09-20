"use client"
import React from "react"
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { useTheme } from "@/context/themecontext";
export default function LendLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const { connected, isLoading } = useWallet();
    const { theme } = useTheme()
    const paths = [
        {
            name: "Give a Loan",
            to: "assets"
        },
        {
            name: "Loans Given",
            to: "loans"
        },
        {
            name: "Offers Sent",
            to: "offers"
        }
    ]
    return (
        <React.Fragment>
            <section className="inner-banner">
                <div className="container">
                    <div className="row">
                        <div className="col text-center">
                            <h2>Empower Crypto Lending with NFTs</h2>
                            <p className="w-50 m-auto position-relative pt-3">Offer loans backed by NFTs and earn attractive returns while helping others access instant liquidity without selling their digital assets. Start lending today!</p>
                        </div>
                    </div>
                </div>
            </section>
            <section className={`borrow-tabs py-100 ${theme == 'light' ? 'light-theme' : 'dark-theme'}`}>
                <div className="container">
                    <div className="row">
                        <div className="col d-flex box-main">
                            <div className="nav flex-column nav-pills me-4 tab-btns rounded" id="borrow-tabs" role="tablist" aria-orientation="vertical">
                                {
                                    paths.map((path, index) => (
                                        <Link href={`/lend/${path.to}`} className={`tab-btn ${pathname === `/lend/${path.to}` ? "active" : ""}`} key={`borrow-path-${index}`} scroll={false}>{path.name}</Link>
                                    ))
                                }
                            </div>
                            <div className="tab-content rounded">
                                {
                                    connected ? (
                                        children
                                    ) : (
                                        <div className="cn-wallet text-center w-50 m-auto rounded">
                                            <h3>Connect Your Wallet First</h3>
                                            {isLoading ? (
                                                <button className="connect-btn mt-3 rounded">Connecting...</button>
                                            ) : (
                                                <button className="connect-btn mt-3 rounded" data-bs-toggle="modal" data-bs-target="#connectmodal">Connect wallet</button>
                                            )
                                            }
                                        </div>
                                    )
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </React.Fragment >
    )
}