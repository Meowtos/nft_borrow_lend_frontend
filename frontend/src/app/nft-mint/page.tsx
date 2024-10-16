import { Body } from "./Body"
import { project } from "@/utils/constants"
import { NETWORK } from "@/utils/env"
export const metadata = {
    title: `Test NFT - ${project}`,
    description: "Mint Test NFTs"
}

export default function Page(){
    if(NETWORK === "mainnet") {
        return null
    };
    return <Body />
}