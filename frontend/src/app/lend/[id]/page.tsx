import { IListingSchema } from "@/models/listing";
import { Body } from "./Body";

export default async function Page({ params }: { params: { id: string }}){
    const res = await fetch(`http://localhost:3000/api/listing/${params.id}`);
    const response = await res.json();
    if(!res.ok){
        throw new Error(response.message)
    }
    const data: IListingSchema = response.data;
    return <Body tokenListing={data} />
}