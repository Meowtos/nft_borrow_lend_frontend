'use client'
import Image from 'next/image'
import { WalletButtons } from './WalletButton';
import Link from 'next/link';

import { VscColorMode } from "react-icons/vsc";
import { useTheme } from '@/context/themecontext';
const Header = () => {
    const { theme, toggleTheme } = useTheme();
    return (
        <>
            <section className="header py-3">
                <div className="container p-0">
                    <div className="row m-0">
                        <div className="col-5 p-0 logo">
                            <Link href={"/"}>
                                <Image src="/media/logo3.png" alt="logo" height={60} width={150} />
                            </Link>
                        </div>
                        <div className="col-7 p-0 text-end d-flex align-center justify-content-end">
                            <VscColorMode className={`${theme} me-3 theme-mode`} onClick={toggleTheme}/>
                            <WalletButtons />
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}
export default Header;