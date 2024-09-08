"use client";

import {
  useWallet,
  WalletReadyState,
  Wallet,
  isRedirectable,
  WalletName,
} from "@aptos-labs/wallet-adapter-react";

export const WalletButtons = () => {
  const { wallets, connected, disconnect, isLoading } = useWallet();

  if (connected) {
    return <button onClick={disconnect} className="connect-btn rounded">Disconnect</button>;
  }

  if (isLoading || !wallets || !wallets[0]) {
    return <p>Loading...</p>;
  }

  return <WalletView wallet={wallets[0] as Wallet} />;
};

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
          Connect Wallet
        </button>
      );
    }
    return (
      <button className="connect-btn rounded" disabled={true}>Connect Wallet - Desktop Only</button>
    );
  } else {
    return (
      <button
        disabled={!isWalletReady}
        onClick={() => onWalletConnectRequest(wallet.name)}
        className="connect-btn rounded"
      >
        Connect Wallet
      </button>
    );
  }
};
