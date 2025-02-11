'use client'
import { useState } from 'react'
import Image from 'next/image'
import { WalletButtons } from './WalletButton';
import Link from 'next/link';
import { RxHamburgerMenu } from "react-icons/rx";
import { IoClose } from 'react-icons/io5'

import { useTheme } from '@/context/themecontext';
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { menu } from '@/utils/constants'
// import { DiscordNotification } from './DiscordNotification';
import ThemeToggle from './ThemeToggle';
import { usePathname } from 'next/navigation'
import { useApp } from '@/context/AppProvider';
import { chains } from '@/utils/chain';
import { Wallets } from './wallets';

import { storage } from '@/utils/storage';
const Header = () => {
    const { theme } = useTheme();
    const { chain, setChain } = useApp();
    const [mobileMenu, setMobileMenu] = useState(false)
    const pathname = usePathname();
    return (
        <>
            <section className={`header py-3 ${theme === 'dark' ? 'dark-theme' : 'light-theme'}`}>
                <div className="container p-0">
                    <div className="row m-0">
                        <div className="col-5 col-sm-1 col-lg-4 p-0 logo">
                            <Link href={"/"}>
                                <Image src="/media/logo.png" alt="logo" height={65} width={65} className='rounded' />
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
                                    <div className="dropdown">
                                        <a className="btn btn-secondary dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                            <Image src={chain.icon} alt={chain.name} height={22} width={22} />
                                        </a>

                                        <ul className="dropdown-menu">
                                            {
                                                chains.map((item, idx) => (
                                                    <li key={idx} onClick={()=>{
                                                        storage.set("lend-borrow-chain", JSON.stringify(item))
                                                        setChain(item)
                                                    }}>
                                                        <a className="dropdown-item text-capitalize" href="#">
                                                            <Image src={item.icon} alt={item.name} height={22} width={22} />&nbsp;
                                                            {item.name}
                                                        </a>
                                                    </li>
                                                ))
                                            }
                                        </ul>
                                    </div>
                                </ul>
        
                                <ThemeToggle />

                            </div>
                            {/* <DiscordNotification /> */}
                            <Wallets />

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
