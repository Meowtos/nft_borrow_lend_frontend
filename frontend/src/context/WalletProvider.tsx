"use client";

import { AptosWalletAdapterProvider } from "@aptos-labs/wallet-adapter-react";
import { PetraWallet } from "petra-plugin-wallet-adapter";
import { ReactNode } from "react";
import {NETWORK} from "../utils/env"
import { NetworkToNetworkName } from "@aptos-labs/ts-sdk";

const wallets = [new PetraWallet()];

export function WalletProvider({ children }: { children: ReactNode }) {
  return (
    <AptosWalletAdapterProvider plugins={wallets} autoConnect={true} dappConfig={{
      network: NetworkToNetworkName[NETWORK]
    }}>
      {children}
    </AptosWalletAdapterProvider>
  );
}
