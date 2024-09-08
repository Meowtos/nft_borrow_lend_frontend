import { Body } from "./Body";
export default function Page({ params }: { params: { collectionId: string, tokenDataId: string}}){
    return <Body collectionId={params.collectionId} tokenDataId={params.tokenDataId} />
}