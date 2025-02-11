type ChainName = "aptos" | "movement" | "supra";
export type Chain = {
    name: ChainName;
    icon: string;
}

export const chains: Array<Chain> = [
    {
        name: "aptos",
        icon: "/icons/aptos.jpg"
    },
    {
        name: "movement",
        icon: "/icons/movement.jpg"
    },
    {
        name: "supra",
        icon: "/icons/supra.png"
    }
]

type Token = {
    name: string;
    symbol: string;
    decimals: number;
    icon: string;
    token_address: string;
    chain: ChainName;
    version: "v1" | "v2";
}

const operatingTokens: Array<Token> = [
    {
        name: "Aptos",
        symbol: "APT",
        decimals: 8,
        icon: "/icons/aptos.jpg",
        chain: "aptos",
        token_address: "0x1::aptos_coin::AptosCoin",
        version: "v1"
    },
    {
        name: "Movement",
        symbol: "MOVE",
        decimals: 8,
        icon: "/icons/movement.jpg",
        chain: "movement",
        token_address: "0x1::aptos_coin::AptosCoin",
        version: "v1"
    },
    {
        name: "Supra",
        symbol: "SUPRA",
        decimals: 8,
        icon: "/icons/supra.png",
        chain: "supra",
        token_address: "0x1::supra_coin::SupraCoin",
        version: "v1"
    }
]

export function getChainOperatingTokens(chainName: ChainName) {
    return operatingTokens.filter((token) => token.chain === chainName) 
}