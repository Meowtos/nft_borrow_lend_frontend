"use client";

import { FA } from "@/types/Fa";
// import { getFAMetadata } from "@/utils/aptos";
import { Chain, chains } from "@/utils/chain";
import { storage } from "@/utils/storage";
import { TokenStandard } from "@aptos-labs/ts-sdk";
import { createContext, Dispatch, SetStateAction, useContext, useEffect, useState } from "react";
type AppContextType = {
    assets: FA[],
    getAssetByType: (type: string) => FA | undefined;
    chain: Chain;
    setChain: Dispatch<SetStateAction<Chain>>;
    connectedAddress: string | null;
    setConnectedAddress: Dispatch<SetStateAction<string|null>>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
    children
}) =>  {
    const [chain, setChain] = useState<Chain>(chains[0]);
    const [loading, setLoading] = useState(true);
    const [connectedAddress, setConnectedAddress] = useState<string|null>(null)
    const [assets, setAssets] = useState<FA[]>([]);
    const getAssetByType = (type: string): FA | undefined => {
        return assets.find(asset => asset.asset_type === type);
    }
    // useEffect(()=>{
    //     getFAMetadata().then((res)=>{
    //         const result: FA[] = [];
    //         for(const fa of res){
    //             result.push({
    //                 asset_type: fa.asset_type,
    //                 name: fa.name,
    //                 symbol: fa.symbol,
    //                 decimals: fa.decimals,
    //                 icon_uri: fa.icon_uri ?? "/aptos.png",
    //                 token_standard: fa.token_standard as TokenStandard
    //             })
    //         };
    //         setAssets(result);
    //     })
    // },[setAssets])

    useEffect(()=>{
        (()=>{
            const chain = storage.get("lend-borrow-chain");
            if(chain) {
                const parsedChain = JSON.parse(chain);
                setChain(parsedChain)
            }
            setLoading(false)
        })()
    },[])
    if(loading) return null;
    return(
        <AppContext.Provider value={{
            assets,
            getAssetByType,
            chain,
            setChain,
            connectedAddress,
            setConnectedAddress
        }}>
            {children}
        </AppContext.Provider>
    )
}

export const useApp = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error("useApp must be used within a AppProvider");
    }
    return context;
};
