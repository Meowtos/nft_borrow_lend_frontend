"use client"
import { discordLink, footerLinks, project, team, twitterLnk } from '@/utils/constants';
import Image from 'next/image'
import Link from 'next/link'
import { BsDiscord } from "react-icons/bs";
import { BsTwitter } from "react-icons/bs";
import { useTheme } from '@/context/themecontext';

const Footer = () => {
    const { theme } = useTheme()
    return (
        <>
            <section className={`footer ${theme == 'light' ? 'light-theme' : 'dark-theme'}`}>
                <div className="container">
                    <div className="row popped rounded">
                        <div className="col-lg-3 pe-5">
                            {
                                theme == 'dark'
                                    ?
                                    <Image src="/media/octos4.png" alt="logo" height={65} width={75} className='rounded' />
                                    :
                                    <Image src="/media/octos3.png" alt="logo" height={65} width={75} className='rounded' />
                            }
                            <p className='pt-3'>Unlock liquidity without selling your NFTs. Use them as collateral for secure, decentralized loans and retain ownership of your digital assets.</p>
                        </div>
                        <div className="col-lg-3">
                            <h4>Quick View</h4>
                            <p className="br"></p>
                            <ul className='ft-list m-0 p-0'>
                                {
                                    footerLinks.map((v, idx) => (
                                        <Link href={v.path} key={`path-${idx}`}>
                                            <li>{v.heading}</li>
                                        </Link>
                                    ))
                                }
                            </ul>
                        </div>
                        <div className="col-lg-3">
                            <h4>Meet The Team</h4>
                            <p className="br"></p>
                            <ul className='ft-list m-0 p-0'>
                                {
                                    team.map((v, idx) => (
                                        <Link href={v.github} target='_blank' key={`team-${idx}`}>
                                            <li><Image src={v.profile} alt="profile" height={24} width={24} className='me-2 rounded-circle' />{v.name}</li>
                                        </Link>
                                    ))
                                }
                            </ul>
                        </div>
                        <div className="col-lg-3">
                            <h4>Socials</h4>
                            <p className="br"></p>
                            <div className="social d-flex gap-2">
                                <Link href={discordLink} target='_blank'>
                                    <BsDiscord className='sc-icon' />
                                </Link>
                                <Link href={twitterLnk}>
                                    <BsTwitter className='sc-icon' />
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="row mt-4 pt-2 ft-bottom">
                        <div className="col">
                            <p className="m-0">@Copyright 2024 {project}</p>
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