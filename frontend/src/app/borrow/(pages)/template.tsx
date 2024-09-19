"use client"
import React from "react"
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { useTheme } from "@/context/themecontext";
export default function BorrowLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const { connected, isLoading } = useWallet();
    const {theme} = useTheme()
    const paths = [
        {
            name: "My Assets",
            to: "assets"
        },
        {
            name: "My Loans",
            to: "loans"
        },
        {
            name: "Offers Received",
            to: "offers"
        }
    ]
    return (
        <React.Fragment>
            <section className="inner-banner">
                <div className="container">
                    <div className="row">
                        <div className="col text-center">
                            <h2>Unlock Crypto Loans with Your NFTs</h2>
                            <p className="w-50 m-auto position-relative pt-3">Leverage your NFTs as collateral and access instant liquidity without selling your digital assets. Get quick, transparent loans today!</p>
                        </div>
                    </div>
                </div>
            </section>
            <section className={`borrow-tabs py-100 ${theme == 'light' ? 'light-theme' : 'dark-theme'}`}>
                <div className="container">
                    <div className="row">
                        <div className="col d-flex box-main">
                            {/* <div className="nav flex-column nav-pills me-4 tab-btns" id="borrow-tabs" role="tablist" aria-orientation="vertical">
                                {
                                    paths.map((path, index) => (
                                        <Link href={`/borrow/${path.to}`} className={`tab-btn ${pathname === `/borrow/${path.to}` ? "active" : ""}`} key={`borrow-path-${index}`} scroll={false}>{path.name}</Link>
                                    ))
                                }
                            </div>
                            <div className="tab-content rounded" id="borrow-tabs-tabContent">
                                {
                                    paths.map((path, index) => (
                                        <div key={`borrow-content-${index}`} className={`tab-pane fade ${pathname === `/borrow/${path.to}` ? "show active" : ""}`} id={`borrow-${path.to}`} role="tabpanel" aria-labelledby={`borrow-${path}`}>
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
                                    ))
                                }
                            </div> */}
                            <div className="nav flex-column nav-pills me-4 tab-btns" id="borrow-tabs" role="tablist" aria-orientation="vertical">
                                {
                                    paths.map((path, index) => (
                                        <Link href={`/borrow/${path.to}`} className={`tab-btn ${pathname === `/borrow/${path.to}` ? "active" : ""}`} key={`borrow-path-${index}`} scroll={false}>{path.name}</Link>
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