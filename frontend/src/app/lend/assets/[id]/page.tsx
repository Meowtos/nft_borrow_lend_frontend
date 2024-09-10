// /lend/assets/id
import { IListingSchema } from "@/models/listing";
import { Body } from "./Body";
import { APP_URL } from "@/utils/env";

export default async function Page({ params }: { params: { id: string }}){
    const res = await fetch(`${APP_URL}/api/listing/${params.id}`);
    const response = await res.json();
    if(!res.ok){
        throw new Error(response.message)
    }
    const data: IListingSchema = response.data;
    return <Body tokenListing={data} />
}