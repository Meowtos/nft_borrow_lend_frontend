"use client"
import { IWallet, useWallet } from "@razorlabs/razorkit"
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
export function MovementWalletButton() {
    const { setConnectedAddress } = useApp()
    const { account, connected, disconnect, allAvailableWallets } = useWallet()
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
    useEffect(()=>{
        if(account?.address) {
            setConnectedAddress(account.address)
        } else {
            setConnectedAddress(null)
        }
    },[account?.address])
    if (connected && account?.address) {
        return (
            <div className="connected d-flex align-center">
                <button className="connect-btn rounded disconnect dropdown-toggle position-relative" data-bs-toggle="dropdown" aria-expanded="false" >{shortenAddress(account.address)}<RiArrowDropDownLine className="arrow-icon" /></button>
                <ul className="dropdown-menu p-0 rounded wallet-dd">
                    <li className="px-3 py-3" onClick={handleCopy(account.address)}><BsCopy className="me-2" />Copy Address</li>
                    <li className="px-3 py-3" onClick={disconnect}><RxExit className="me-2" /> Disconnect</li>
                </ul>
            </div>
        )
    }
    
    return <WalletList wallets={allAvailableWallets} />;
}

const WalletList = ({ wallets }: { wallets: IWallet[] }) => {
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
  
  const WalletView = ({ wallet }: { wallet: IWallet }) => {
    const { select } = useWallet();
    const isWalletReady =
      wallet.installed;
  
    const onWalletConnectRequest = async (walletName: string) => {
      try {
        select(walletName);
      } catch (error) {
        console.warn(error);
        window.alert("Failed to connect wallet");
      }
    };
    if (!isWalletReady) {
      return (
        <button className="wl-item rounded w-100" disabled={true}>
          <Image
            alt={wallet.name}
            src={wallet.iconUrl}
            height={20}
            width={20}
          />&nbsp;{wallet.name} - Not Installed
        </button>
      );
    } else {
      return (
        <>
          <button disabled={!isWalletReady} onClick={() => onWalletConnectRequest(wallet.name)} data-bs-dismiss="modal" className={`wl-item rounded w-100 ${!isWalletReady ? 'disabled' : 'active'}`} >
            <Image alt={wallet.name} src={wallet.iconUrl} height={20} width={20} />&nbsp;
            {wallet.name}
          </button>
        </>
      );
    }
  };