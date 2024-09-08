import { connectDB } from "@/lib/connect";
import { Listing } from "@/models/listing";
import { NextResponse } from "next/server";
connectDB()
type Params = {
    params : {
        id: string
    }
}
export async function GET(req: Request, context: Params){
    try {
        const { id } = context.params;
        const exists = await Listing.findById(id);
        if(!exists){
            throw new Error("Listing doesn't exist")
        }
        return NextResponse.json({ data: exists })
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 })
    }
}