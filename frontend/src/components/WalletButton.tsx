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

export const WalletButtons = () => {
  const { wallets, connected, disconnect, isLoading } = useWallet();

  if (connected) {
    return (
      <>
        <button onClick={disconnect} className="connect-btn rounded">Disconnect</button>;
      </>
    )
  }

  if (isLoading || !wallets || !wallets[0]) {
    return <p>Loading...</p>;
  }

  return <WalletList wallets={wallets as Wallet[]} />;
};

const WalletList = ({ wallets }: { wallets: Wallet[] }) => {
  return (
    <React.Fragment>
      <button type="button" className="connect-btn" data-bs-toggle="modal" data-bs-target="#staticBackdrop">
        Connect Wallet
      </button>
      <div className="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex={-1} aria-labelledby="staticBackdropLabel" aria-hidden="true">
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
      <button disabled={!isWalletReady} onClick={() => onWalletConnectRequest(wallet.name)} className={`wl-item rounded w-100 ${!isWalletReady ? 'disabled' : 'active'}`} >
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
};
