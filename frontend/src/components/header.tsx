'use client'
import { useState } from 'react'
import Image from 'next/image'
import { WalletButtons } from './WalletButton';
import Link from 'next/link';
import { FaAward } from "react-icons/fa6";
import { RxHamburgerMenu } from "react-icons/rx";
import { IoClose } from 'react-icons/io5'

import { useTheme } from '@/context/themecontext';
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { menu } from '@/utils/constants'
import { DiscordNotification } from './DiscordNotification';
import ThemeToggle from './ThemeToggle';
import { usePathname } from 'next/navigation'

const Header = () => {
    const { theme } = useTheme();
    const { connected } = useWallet();
    const [soon, setSoon] = useState(true);
    const [mobileMenu, setMobileMenu] = useState(false)
    const pathname = usePathname();
    return (
        <>
            <section className={`header py-3 ${theme === 'dark' ? 'dark-theme' : 'light-theme'}`}>
                <div className="container p-0">
                    <div className="row m-0">
                        <div className="col-5 col-sm-1 col-lg-4 p-0 logo">
                            <Link href={"/"}>
                                <Image src="/media/logo2.png" alt="logo" height={65} width={75} className='rounded' />
                            </Link>
                        </div>

                        <div className="col-7 col-sm-11 col-lg-8 p-0 d-flex align-center justify-content-end menu-large">
                            {/* menu large screen */}
                            <div className="menu d-flex align-center">
                                <ul className='d-flex m-0 p-0 nav-menu me-4'>
                                    {
                                        menu.map((y, idx) => (
                                            <Link href={y.url} key={idx} className={`${(y.url === '/' ? pathname === y.url : pathname.startsWith(y.url)) ? 'active' : ''}`}>
                                                <li>{y.name}</li>
                                            </Link>
                                        ))
                                    }
                                </ul>
                                <ThemeToggle />
                                {
                                    connected ? (
                                        <div className="rewards" id="rewards">
                                            {/* <FaAward className="cn-icon" onClick={() => setSoon(!soon)} /> */}
                                            <span className="cn-icon" onClick={() => setSoon(!soon)} >s:01</span>
                                            <p className="soon rounded-pill mt-2" hidden={soon}>Season-1 Rewards Available Soon!</p>
                                        </div>
                                    ) : (' ')
                                }
                            </div>
                            <DiscordNotification />
                            <WalletButtons />

                            {/* Mobile Menu */}
                            <div className="menu-mobile">
                                <RxHamburgerMenu className='toggle-btn' onClick={() => setMobileMenu(!mobileMenu)} />
                                <div className={`toggle-menu ${mobileMenu ? 'active' : ' '}`}>
                                    <IoClose className="menu-close" onClick={() => setMobileMenu(!mobileMenu)} />
                                    <ul className='m-0 p-0 nav-menu'>
                                        {
                                            menu.map((y, idx) => (
                                                <Link
                                                    href={y.url}
                                                    key={idx}
                                                    className={`${(y.url === '/' ? pathname === y.url : pathname.startsWith(y.url)) ? 'active' : ''}`}
                                                    onClick={() => setMobileMenu(!mobileMenu)}>
                                                    <li>{y.name}</li>
                                                </Link>
                                            ))
                                        }
                                    </ul>
                                    <ThemeToggle />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section >
        </>
    )
}
export default Header;
