import { Body } from "./Body"
import { project } from "@/utils/constants"

export const metadata = {
    title: `Test NFT - ${project}`,
    description: "Mint Test NFTs"
}
export default function Page(){
    return <Body />
}