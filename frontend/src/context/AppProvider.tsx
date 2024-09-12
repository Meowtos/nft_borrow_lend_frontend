"use client";

import { FA } from "@/types/Fa";
import { getFAMetadata } from "@/utils/aptos";
import { createContext, useContext, useEffect, useState } from "react";
type AppContextType = {
    assets: FA[],
    getAssetByType: (type: string) => FA | undefined
}
const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
    children
}) =>  {
    const [assets, setAssets] = useState<FA[]>([]);
    const getAssetByType = (type: string): FA | undefined => {
        return assets.find(asset => asset.asset_type === type);
    }
    useEffect(()=>{
        getFAMetadata().then((res)=>{
            const result: FA[] = [];
            for(const fa of res){
                result.push({
                    asset_type: fa.asset_type,
                    name: fa.name,
                    symbol: fa.symbol,
                    decimals: fa.decimals,
                    icon_uri: fa.icon_uri ?? "/aptos.png",
                    token_standard: fa.token_standard
                })
            };
            setAssets(result);
        })
    },[setAssets])
    return(
        <AppContext.Provider value={{
            assets,
            getAssetByType
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
