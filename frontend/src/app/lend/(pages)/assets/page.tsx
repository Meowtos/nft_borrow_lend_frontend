// lend/assets (Give a new loan)
import { IListingSchema } from "@/models/listing";
import { Body } from "./Body";
import { APP_URL } from "@/utils/env";

export const dynamic = "force-dynamic";
export default async function Page(){
    const res = await fetch(`${APP_URL}/api/listing`);
    const response = await res.json();
    if(!res.ok){
        throw new Error(response.message)
    }
    const data: IListingSchema[] = response.data;
    return <Body tokensListing={data} />

}