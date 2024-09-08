import { connectDB } from "@/lib/connect";
import { Listing } from "@/models/listing";
import { NextResponse } from "next/server";
connectDB();

export async function GET(req: Request) {
    try {
        const data = await Listing.find();
        return NextResponse.json({ message: "success", data }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
export async function POST(req: Request) {
    try {
        const request = await req.json();
        const exists = await Listing.findOne({
            account_address: request.account_address,
            token_data_id: request.token_data_id,
            status: "open"
        })
        if (exists) {
            throw new Error("Listing exists");
        }
        const newListing = new Listing(request);
        await newListing.save();
        return NextResponse.json({ message: "success" }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}