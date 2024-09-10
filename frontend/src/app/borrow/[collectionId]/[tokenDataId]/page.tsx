import { Body } from "./Body";
export const metadata = {
    title: "Token - DeFi NFT Loans",
    description: "Token information of particular collection"
}
export default function Page({ params }: { params: { collectionId: string, tokenDataId: string}}){
    return <Body collectionId={params.collectionId} tokenDataId={params.tokenDataId} />
}