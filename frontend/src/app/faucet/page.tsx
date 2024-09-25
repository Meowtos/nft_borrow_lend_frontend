import { project } from "@/utils/constants";
import { Body } from "./Body";
export const metadata = {
    title: `Testnet Faucet - ${project}`,
    description: "Get faucet tokens"
}
export default function Page(){
    return <Body />
}