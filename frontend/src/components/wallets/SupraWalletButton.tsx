"use client"
import { useSupraWallet } from "@/context/SupraWalletProvider";
import React, { useEffect } from "react";
import { BsCopy } from "react-icons/bs";
import { RxExit } from "react-icons/rx";
import { toast } from "sonner";
import { useCopyToClipboard } from "usehooks-ts";
import { useApp } from "@/context/AppProvider";
import { shortenAddress } from "@/utils/shortenAddress";
import { RiArrowDropDownLine } from "react-icons/ri";
import { IoClose } from "react-icons/io5";
import Image from "next/image";
export function SupraWalletButton() {
    const { setConnectedAddress } = useApp()
    const { address, disconnect, allAvailableWallets } = useSupraWallet()
    const [copiedText, copy] = useCopyToClipboard()
    const handleCopy = (text: string) => () => {
        copy(text)
            .then(() => {
                toast.success("Copied")
            })
            .catch(error => {
                toast.success("Failed to copy")
                console.error('Failed to copy!', error)
            })
        console.log('Copied!', { copiedText })
    }
    useEffect(() => {
        if (address) {
            setConnectedAddress(address)
        } else {
            setConnectedAddress(null)
        }
    }, [address])
    if (address) {
        return (
            <div className="connected d-flex align-center">
                <button className="connect-btn rounded disconnect dropdown-toggle position-relative" data-bs-toggle="dropdown" aria-expanded="false" >{shortenAddress(address)}<RiArrowDropDownLine className="arrow-icon" /></button>
                <ul className="dropdown-menu p-0 rounded wallet-dd">
                    <li className="px-3 py-3" onClick={handleCopy(address)}><BsCopy className="me-2" />Copy Address</li>
                    <li className="px-3 py-3" onClick={disconnect}><RxExit className="me-2" /> Disconnect</li>
                </ul>
            </div>
        )
    }

    return <WalletList wallets={allAvailableWallets} />;
}

const WalletList = ({ wallets }: { wallets: Array<{ name: string; iconUrl: string }> }) => {
    return (
        <React.Fragment>
            <button type="button" className="connect-btn rounded cs-cnn" data-bs-toggle="modal" data-bs-target="#connectmodal">Connect Wallet</button>
            <div className="modal fade" id="connectmodal" tabIndex={-1} aria-labelledby="areaLabel" aria-hidden="true" >
                <div className="modal-dialog modal-dialog-centered wallet-modal">
                    <div className="modal-content">
                        <div className="modal-header text-center py-4">
                            <h1 className="modal-title w-100 fs-3">Connect Wallet</h1>
                            <IoClose type="button" className="text-light close-icon" data-bs-dismiss="modal" aria-label="Close" />
                        </div>
                        <div className="modal-body text-center p-0">
                            {wallets.map((wallet, index) => (
                                <div key={index} >
                                    <WalletView wallet={wallet} key={index} />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

        </React.Fragment>
    )
}

const WalletView = ({ wallet }: { wallet: { name: string; iconUrl: string } }) => {
    const { connect } = useSupraWallet();
    const onWalletConnectRequest = async () => {
        try {
            connect();
        } catch (error) {
            console.warn(error);
            window.alert("Failed to connect wallet");
        }
    };

    return (
        <>
            <button onClick={() => onWalletConnectRequest()} data-bs-dismiss="modal" className={`wl-item rounded w-100`} >
                <Image alt={wallet.name} src={wallet.iconUrl} height={20} width={20} />&nbsp;
                {wallet.name}
            </button>
        </>
    );
};