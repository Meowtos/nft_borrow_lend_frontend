"use client"
import { discordLink, footerLinks, project, telegramLink, twitterLnk } from '@/utils/constants';
import Image from 'next/image'
import Link from 'next/link'
import { BsDiscord, BsTelegram } from "react-icons/bs";
import { useTheme } from '@/context/themecontext';
import { BsTwitterX } from "react-icons/bs";


const Footer = () => {
    const { theme } = useTheme()
    return (
        <>
            <section className={`footer ${theme == 'light' ? 'light-theme' : 'dark-theme'}`}>
                <div className="container">
                    <div className="row popped rounded">
                        <div className="col-lg-3 pe-5">
                            <Image src="/media/logo.png" alt="logo" height={65} width={70} className='rounded footer-logo' />
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
                            <h4>Our Products</h4>
                            <p className="br"></p>
                            <ul className='ft-list m-0 p-0'>
                                <Link href={"https://t.me/meow_sniper_bot"} target='_blank'>
                                    <li><Image src={"https://pbs.twimg.com/media/GZvTyiLW0AEqNwO?format=jpg&name=small"} alt="meow_bot" height={24} width={24} className='me-2 rounded-circle' />Meow Bot</li>
                                </Link>
                                <Link href={"https://meowtos.xyz/spin"} target='_blank'>
                                    <li><Image src={"https://pbs.twimg.com/media/GZYWF4nasAUNNlg?format=png&name=small"} alt="meow_spin" height={24} width={24} className='me-2 rounded-circle' />Meow Spin</li>
                                </Link>
                                <Link href={"https://app.legends.trade/?network=aptos"} target='_blank'>
                                    <li><Image src={"https://pbs.twimg.com/profile_images/1783544053365157888/N8BVsRZo_400x400.jpg"} alt="premarket" height={24} width={24} className='me-2 rounded-circle' />Pre-Market</li>
                                </Link>
                                <Link href={"https://app.panora.exchange/swap?pair=APT_MEOW"} target='_blank'>
                                    <li><Image src={"https://pbs.twimg.com/profile_images/1768967680357548032/ZIjlSSQ__400x400.jpg"} alt="buy_meow" height={24} width={24} className='me-2 rounded-circle' />Buy $MEOW</li>
                                </Link>
                              
                            </ul>
                        </div>
                        <div className="col-lg-3">
                            <h4>Socials</h4>
                            <p className="br"></p>
                            <div className="social d-flex gap-2">
                                <Link href={discordLink} target='_blank'>
                                    <BsDiscord className='sc-icon' />
                                </Link>
                                <Link href={twitterLnk} target='_blank'>
                                    <BsTwitterX className='sc-icon'/>
                                </Link>
                                <Link href={telegramLink} target='_blank'>
                                    <BsTelegram className='sc-icon'/>
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