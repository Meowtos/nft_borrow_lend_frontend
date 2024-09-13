"use client"
import React from "react"
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function LendLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
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
                            <h2>Unlock Crypto Loans with Your NFTs</h2>
                            <p className="w-50 m-auto position-relative pt-3">Leverage your NFTs as collateral and access instant liquidity without selling your digital assets. Get quick, transparent loans today!</p>
                        </div>
                    </div>
                </div>
            </section>
            <section className="borrow-tabs py-100">
                <div className="container">
                    <div className="row">
                        <div className="col">
                            <div className="d-flex">
                                <div className="nav flex-column nav-pills me-4 tab-btns" id="lend-tabs" role="tablist" aria-orientation="vertical">
                                    {
                                        paths.map((path, index) => (
                                            <Link href={`/lend/${path.to}`} className={`tab-btn ${pathname === `/lend/${path.to}` ? "active" : ""}`} key={`lend-path-${index}`} scroll={false}>
                                                {/* <button
                                                    className="tab-btn"
                                                    id={`lend-${path.to}-tab`}
                                                    data-bs-toggle="pill"
                                                    data-bs-target={`#lend-${path.to}`}
                                                    type="button"
                                                    role="tab"
                                                    aria-controls={`lend-${path.to}`}
                                                    aria-selected="true"
                                                > */}
                                                    {path.name}
                                                {/* </button> */}
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
                </div>
            </section>
        </React.Fragment >
    )
}