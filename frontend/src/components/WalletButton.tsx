"use client";

import {
  useWallet,
  WalletReadyState,
  Wallet,
  isRedirectable,
  WalletName,
} from "@aptos-labs/wallet-adapter-react";
import React from "react";

export const WalletButtons = () => {
  const { wallets, connected, disconnect, isLoading } = useWallet();

  if (connected) {
    return <button onClick={disconnect} className="connect-btn rounded">Disconnect</button>;
  }

  if (isLoading || !wallets || !wallets[0]) {
    return <p>Loading...</p>;
  }

  return <WalletList wallets={wallets as Wallet[]}/>;
};

const WalletList = ({ wallets }: { wallets: Wallet[] }) => {
  return (
    <React.Fragment>
      <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#staticBackdrop">
        Connect Wallet
      </button>
      <div className="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex={-1} aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="staticBackdropLabel">Connect Wallet</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              {wallets.map((wallet, index)=>(
                <div key={index}>
                    <WalletView wallet={wallet} key={index}/>
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
        <button className="connect-btn rounded" onClick={() => onWalletConnectRequest(wallet.name)}>
          {wallet.name}
        </button>
      );
    }
    return (
      <button className="connect-btn rounded" disabled={true}>{wallet.name} - Desktop Only</button>
    );
  } else {
    return (
      <button
        disabled={!isWalletReady}
        onClick={() => onWalletConnectRequest(wallet.name)}
        className="connect-btn rounded"
      >
        {wallet.name}
      </button>
    );
  }
};
