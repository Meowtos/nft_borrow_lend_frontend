import { project } from "@/utils/constants";
import { Body } from "./Body";
import { NETWORK } from "@/utils/env"
export const metadata = {
    title: `Testnet Faucet - ${project}`,
    description: "Get faucet tokens"
}
export default function Page(){
    if(NETWORK === "mainnet") {
        return null
    };
    return <Body />
}