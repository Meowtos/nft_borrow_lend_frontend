"use client"

import { StarkeyObject, StarkeyProvider } from "@/types/starkey";
import { errorMessage } from "@/utils/errorMessage";
import { createContext, useContext, useEffect, useState } from "react";

interface StarkeyWindow extends Window {
    starkey?: StarkeyObject
}

declare const window: StarkeyWindow;

type WalletContextType = {
    address: string | null;
    accounts: string[];
    connect: () => Promise<void>;
    disconnect: () => Promise<void>;
    networkData: NetworkInfo | null;
    supraWallet: StarkeyProvider | undefined;
    allAvailableWallets: Array<{ name: string; iconUrl: string }>
}

type NetworkInfo = {
    chainId: string
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const SupraWalletProvider: React.FC<{ children: React.ReactNode, autoConnect: boolean }> = ({
    children,
    autoConnect
}) =>  {
    const getProvider = () => {
        if (typeof window !== "undefined" && 'starkey' in window) {
            if (window.starkey?.supra) {
                return window.starkey.supra;
            }
        }
    };

    const allAvailableWallets = [ { name: "Starkey", iconUrl: "/icons/starkey.png" }]

    const supraWallet = getProvider()
    const [address, setAddress] = useState<string|null>(null);
    const [accounts, setAccounts] = useState<string[]>([]);
    const [networkData, setNetworkData] = useState<NetworkInfo | null>(null)

    const connect = async() => {
        try {
            const provider = getProvider();
            if(!provider) throw new Error("Starkey wallet is not installed");
            const accounts = await provider.connect();
            setAccounts(accounts)
            setAddress(accounts[0])
            const networkInfo = await provider.getChainId();
            setNetworkData(networkInfo)
        } catch (error) {
            throw new Error(errorMessage(error))
        }
    }

    const disconnect = async() => {
        try {
            const provider = getProvider();
            if(!provider) throw new Error("Starkey wallet is not installed");
            await provider.disconnect();
        } catch (error) {
            throw new Error(errorMessage(error))
        }
    }

    useEffect(()=>{
        const provider = getProvider();
        if(!provider) return;
        provider.on("accountChanged", (accounts:string[])=>{
            const account = accounts[0];
            setAccounts(accounts)
            setAddress(account)
        })
        provider.on("networkChanged", (networkInfo: NetworkInfo)=>{
            setNetworkData(networkInfo)
        })
        provider.on("disconnect", ()=>{
            setAccounts([])
            setAddress(null)
        })
    },[])

    useEffect(()=>{
        if(autoConnect) {
            connect()
        }
    },[autoConnect])

    return(
        <WalletContext.Provider value={{
            address,
            accounts,
            connect,
            disconnect,
            networkData,
            supraWallet,
            allAvailableWallets
        }}>
            {children}
        </WalletContext.Provider>
    )
}

export const useSupraWallet = () => {
    const context = useContext(WalletContext);
    if (!context) {
        throw new Error("useSupraWallet must be used within a SupraWalletProvider");
    }
    return context;
};