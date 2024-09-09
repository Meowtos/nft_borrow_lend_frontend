import Image from 'next/image'
import { WalletButtons } from './WalletButton';
import Link from 'next/link';
const Header = () => {
    return (
        <>
            <section className="header py-3">
                <div className="container">
                    <div className="row m-0">
                        <div className="col p-0">
                            <Link href={"/"}>
                                <Image src="/media/logo3.png" alt="logo" height={60} width={150} />
                            </Link>
                        </div>
                        <div className="col p-0 text-end">
                            <WalletButtons />
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}
export default Header;