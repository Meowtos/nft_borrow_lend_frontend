import Image from 'next/image'
import { WalletButtons } from './WalletButton';
const Header = () => {
    return (
        <>
            <section className="header py-3">
                <div className="container">
                    <div className="row m-0">
                        <div className="col p-0">
                        {/* <Image src="/media/logo.png" alt="logo" height={80} width={190} /> */}
                        {/* <Image src="/media/logo2.png" alt="logo" height={80} width={90} /> */}
                        <Image src="/media/logo3.png" alt="logo" height={60} width={150} />
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