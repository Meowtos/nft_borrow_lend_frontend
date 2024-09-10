import { connectDB } from "@/lib/connect";
import { Listing } from "@/models/listing";
import { NextRequest, NextResponse } from "next/server";
connectDB();

export async function GET(req: NextRequest) {
    try {
        const condition: { [key: string]: string } = {};
        const status = req.nextUrl.searchParams.get("status");
        if (status) {
            condition.status = status;
        }
        const address = req.nextUrl.searchParams.get("address");
        if (address) {
            condition.account_address = address;
        }
        const data = await Listing.find(condition);
        return NextResponse.json({ message: "success", data }, { status: 200 });
    } catch (error: unknown) {
        let errorMessage = 'An unexpected error occurred';
        if (error instanceof Error) {
            errorMessage = error.message;
        }
        return NextResponse.json({ message: errorMessage }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const request = await req.json();
        const exists = await Listing.findOne({
            account_address: request.account_address,
            token_data_id: request.token_data_id,
            status: "open"
        });
        if (exists) {
            throw new Error("Same Listing Already Exists");
        }
        const newListing = new Listing({
            account_address: request.account_address,
            collection_id: request.collection_id,
            token_data_id: request.token_data_id,
            token_name: request.token_name,
            token_icon: request.token_icon,
            fa_metadata: request.fa_metadata,
            amount: request.amount,
            duration: request.duration,
            apr: request.apr,
        });
        await newListing.save();
        return NextResponse.json({ message: "success" }, { status: 200 });
    } catch (error: unknown) {
        let errorMessage = 'An unexpected error occurred';
        if (error instanceof Error) {
            errorMessage = error.message;
        }
        return NextResponse.json({ message: errorMessage }, { status: 500 });
    }
}