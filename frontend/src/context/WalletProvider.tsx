"use client";
import { ReactNode } from "react";

import { AptosWalletAdapterProvider } from "@aptos-labs/wallet-adapter-react";
import { WalletProvider as MovementWalletProvider } from '@razorlabs/razorkit';
import { SupraWalletProvider } from "./SupraWalletProvider";
import { useApp } from "./AppProvider";
import { NetworkToNetworkName } from "@aptos-labs/ts-sdk";
export function WalletProvider({ children }: { children: ReactNode }) {
  const { chain } = useApp();
  return (
    <AptosWalletAdapterProvider autoConnect={chain.name === "aptos"} dappConfig={{
      network: NetworkToNetworkName[process.env.APTOS_NETWORK!]
    }}>
      <MovementWalletProvider autoConnect={chain.name === "movement"}>
        <SupraWalletProvider autoConnect={chain.name === "supra"}>
          {children}
        </SupraWalletProvider>
      </MovementWalletProvider>
    </AptosWalletAdapterProvider>
  );
}
