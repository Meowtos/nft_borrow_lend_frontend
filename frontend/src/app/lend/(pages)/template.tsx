"use client"
import React from "react"
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useTheme } from "@/context/themecontext";

export default function LendLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const {theme} = useTheme();
    const paths = [
        {
            name: "Give a loan",
            to: "assets"
        },
        {
            name: "Loans given",
            to: "loans"
        },
        {
            name: "Offers sent",
            to: "offers"
        }
    ]
    return (
        <React.Fragment>
            <section className="inner-banner">
                <div className="container">
                    <div className="row">
                        <div className="col text-center">
                            <h2>Earn with Crypto Loans by Lending Your NFTs</h2>
                            <p className="w-50 m-auto position-relative pt-3">Put your NFTs to work by lending them out and earn passive income. Offer liquidity to others and benefit from transparent, secure returns!</p>
                        </div>
                    </div>
                </div>
            </section>
            <section className={`borrow-tabs py-100 ${theme == 'light' ? 'light-theme' : 'dark-theme'}`}>
                <div className="container">
                    <div className="row">
                        <div className="col d-flex box-main">
                            <div className="nav flex-column nav-pills me-4 tab-btns" id="lend-tabs" role="tablist" aria-orientation="vertical">
                                {
                                    paths.map((path, index) => (
                                        <Link href={`/lend/${path.to}`} className={`tab-btn ${pathname === `/lend/${path.to}` ? "active" : ""}`} key={`lend-path-${index}`} scroll={false}>
                                            {path.name}
                                        </Link>
                                    ))
                                }
                            </div>
                            <div className="tab-content rounded" id="lend-tabs-tabContent">
                                {
                                    paths.map((path, index) => (
                                        <div key={`lend-content-${index}`} className={`tab-pane fade ${pathname === `/lend/${path.to}` ? "show active" : ""}`} id={`lend-${path.to}`} role="tabpanel" aria-labelledby={`lend-${path}`}>
                                            {children}
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </React.Fragment >
    )
}