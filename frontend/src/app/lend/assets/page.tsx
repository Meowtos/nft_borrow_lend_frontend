// lend/assets (Give a new loan)
import { IListingSchema } from "@/models/listing";
import { Body } from "./Body";

// no need to fetch cache data
export const dynamic = "force-dynamic";
export default async function Page(){
    const res = await fetch("http://localhost:3000/api/listing");
    const response = await res.json();
    if(!res.ok){
        throw new Error(response.message)
    }
    const data: IListingSchema[] = response.data;
    return <Body data={data} />

}