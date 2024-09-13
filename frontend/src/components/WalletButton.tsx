"use client";

import {
  useWallet,
  WalletReadyState,
  Wallet,
  isRedirectable,
  WalletName,
} from "@aptos-labs/wallet-adapter-react";
import Image from "next/image";
import React from "react";
import { IoClose } from "react-icons/io5";
import { FaRegUser } from "react-icons/fa";
import { FaAward } from "react-icons/fa6";
import { FaRegBell } from "react-icons/fa";
import { RxExit } from "react-icons/rx";

export const WalletButtons = () => {
  const { wallets, connected, disconnect, isLoading } = useWallet();

  if (connected) {
    return (
      <>
        <div className="connected">
          <FaRegBell className="cn-icon" />
          <FaRegUser className="cn-icon" />
          <FaAward className="cn-icon" />
          <button onClick={disconnect} className="connect-btn rounded disconnect"><RxExit /> Disconnect</button>
        </div>
      </>
    )
  }

  if (isLoading || !wallets || !wallets[0]) {
    return <button type="button" className="connect-btn">Connecting...</button>;
  }

  return <WalletList wallets={wallets as Wallet[]} />;
};

const WalletList = ({ wallets }: { wallets: Wallet[] }) => {
  return (
    <React.Fragment>
      <button type="button" className="connect-btn" data-bs-toggle="modal" data-bs-target="#connectmodal">Connect Wallet</button>
      
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

const WalletView = ({ wallet }: { wallet: Wallet }) => {
  const { connect } = useWallet();
  const isWalletReady =
    wallet.readyState === WalletReadyState.Installed ||
    wallet.readyState === WalletReadyState.Loadable;
  const mobileSupport = wallet.deeplinkProvider;

  const onWalletConnectRequest = async (walletName: WalletName) => {
    try {
      connect(walletName);
    } catch (error) {
      console.warn(error);
      window.alert("Failed to connect wallet");
    }
  };
  if (!isWalletReady && isRedirectable()) {
    if (mobileSupport) {
      return (
        <button className="wl-item rounded w-100" onClick={() => onWalletConnectRequest(wallet.name)}>
          <Image
            alt={wallet.name}
            src={wallet.icon}
            height={20}
            width={20}
          />&nbsp;
          {wallet.name}
        </button>
      );
    }
    return (
      <button className="wl-item rounded w-100" disabled={true}>
        <Image
          alt={wallet.name}
          src={wallet.icon}
          height={20}
          width={20}
        />&nbsp;{wallet.name} - Desktop Only
      </button>
    );
  } else {
    return (
      <>
        <button disabled={!isWalletReady} onClick={() => onWalletConnectRequest(wallet.name)}  data-bs-dismiss="modal" className={`wl-item rounded w-100 ${!isWalletReady ? 'disabled' : 'active'}`} >
          <Image alt={wallet.name} src={wallet.icon} height={20} width={20} />&nbsp;
          {wallet.name}
        </button>
      </>
    );
  }
};
