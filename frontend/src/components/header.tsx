'use client'
import { useState } from 'react'
import Image from 'next/image'
import { WalletButtons } from './WalletButton';
import Link from 'next/link';
import { VscColorMode } from "react-icons/vsc";
import { FaAward } from "react-icons/fa6";
import { RxHamburgerMenu } from "react-icons/rx";
import { IoClose } from 'react-icons/io5'

import { useTheme } from '@/context/themecontext';
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { menu } from '@/utils/constants'
import { DiscordNotification } from './DiscordNotification';

const Header = () => {
    const { theme, toggleTheme } = useTheme();
    const { connected } = useWallet();
    const [soon, setSoon] = useState(true);
    const [mobileMenu, setMobileMenu] = useState(false)
    return (
        <>
            <section className={`header py-3 ${theme === 'dark' ? 'dark-theme' : 'light-theme'}`}>
                <div className="container p-0">
                    <div className="row m-0">
                        <div className="col-5 col-lg-4 p-0 logo">
                            <Link href={"/"}>
                                <Image src="/media/logo3.png" alt="logo" height={60} width={150} />
                            </Link>
                        </div>

                        {/* menu large screen */}
                        <div className="col-7 col-lg-8 p-0 d-flex align-center justify-content-end menu-large">
                            <div className="menu d-flex align-center">
                                <ul className='d-flex m-0 p-0 nav-menu me-4'>
                                    {
                                        menu.map((y, idx) => (
                                            <Link href={y.url} key={idx} className={`${y.name === 'Home' ? 'active' : ''}`}><li>{y.name}</li></Link>
                                        ))
                                    }
                                </ul>
                                <VscColorMode className={`${theme} me-3 theme-mode`} onClick={toggleTheme} />
                                <DiscordNotification />
                                {
                                    connected ? (
                                        <div className="rewards" id="rewards">
                                            <FaAward className="cn-icon" onClick={() => setSoon(!soon)} />
                                            <p className="soon rounded-pill" hidden={soon}>soon!</p>
                                        </div>
                                    ) : (' ')
                                }
                            </div>
                            <WalletButtons />
                            <div className="menu-mobile">
                                <RxHamburgerMenu className='toggle-btn' onClick={() => setMobileMenu(!mobileMenu)} />
                                <div className={`toggle-menu ${mobileMenu ? 'active' : ' '}`}>
                                    <IoClose className="menu-close" onClick={() => setMobileMenu(!mobileMenu)} />
                                    <ul className='m-0 p-0 nav-menu'>
                                        {
                                            menu.map((y, idx) => (
                                                <Link href={y.url} key={idx} className={`${y.name === 'Home' ? 'active' : ''}`} onClick={() => setMobileMenu(!mobileMenu)}><li>{y.name}</li></Link>
                                            ))
                                        }
                                    </ul>
                                    <VscColorMode className={`${theme} me-3 theme-mode`} onClick={toggleTheme} />
                                </div>
                            </div>
                        </div>

                        {/* Mobile Menu */}
                        {/* <div className="col-7 col-lg-8 p-0 menu-mobile d-none">
                            <WalletButtons />
                            <RxHamburgerMenu className='toggle-btn' onClick={() => setMobileMenu(!mobileMenu)} />
                            <div className={`toggle-menu ${mobileMenu ? 'active' : ' '}`}>
                                <IoClose className="menu-close" onClick={() => setMobileMenu(!mobileMenu)} />
                                <ul className='m-0 p-0 nav-menu'>
                                    {
                                        menu.map((y, idx) => (
                                            <Link href={y.url} key={idx} className={`${y.name === 'Home' ? 'active' : ''}`} onClick={() => setMobileMenu(!mobileMenu)}><li>{y.name}</li></Link>
                                        ))
                                    }
                                </ul>
                                <VscColorMode className={`${theme} me-3 theme-mode`} onClick={toggleTheme} />
                            </div>
                        </div> */}
                    </div>
                </div>
            </section >
        </>
    )
}
export default Header;
