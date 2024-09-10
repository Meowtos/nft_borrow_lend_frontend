"use client"
import { discordLink, footerLinks, gmail, team, twitterLnk } from '@/utils/constants';
import Image from 'next/image'
import Link from 'next/link'
import { BsDiscord } from "react-icons/bs";
import { BsTwitter } from "react-icons/bs";
import { IoMail } from "react-icons/io5";

const Footer = () => {
    return (
        <>
            <section className="footer">
                <div className="container">
                    <div className="row popped rounded">
                        <div className="col-lg-3">
                            <Image src="/media/logo3.png" alt="logo" height={60} width={150} />
                            <p className='pt-3'>Unlock liquidity without selling your NFTs. Use them as collateral for secure, decentralized loans and retain ownership of your digital assets.</p>
                        </div>
                        <div className="col-lg-3">
                            <h4>Quick View</h4>
                            <ul className='ft-list m-0 p-0 pt-3'>
                                {
                                    footerLinks.map((v, idx)=>(
                                        <Link href={v.path} key={`path-${idx}`}>
                                            <li>{v.heading}</li>
                                        </Link>
                                    ))
                                }
                            </ul>
                        </div>
                        <div className="col-lg-3">
                            <h4>Meet the Team</h4>
                            <ul className='ft-list m-0 p-0 pt-3'>
                                {
                                    team.map((v,idx)=>(
                                        <Link href={v.github} target='_blank' key={`team-${idx}`}>
                                            <li>{v.name}</li>
                                        </Link>
                                    ))
                                }
                            </ul>
                        </div>
                        <div className="col-lg-3">
                            <h4>Social</h4>
                            <div className="social pt-3 d-flex gap-2">
                                <Link href={discordLink} target='_blank'>
                                    <BsDiscord className='sc-icon' />
                                </Link>
                                <Link href={twitterLnk} target='_blank'>
                                    <BsTwitter className='sc-icon' />
                                </Link>
                                <Link href={`mailto:${gmail}`}>
                                    <IoMail className='sc-icon' />
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="row mt-4 pt-2">
                        <div className="col">
                            <p className="m-0">@copyright2024-DeFiNFTLoans</p>
                        </div>
                        <div className="col d-flex justify-content-end">
                            <p className="m-0 text-end"><span>Privacy Policy</span> | <span>Terms and conditions</span></p>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}
export default Footer;