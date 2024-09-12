import { connectDB } from "@/lib/connect";
import { Listing } from "@/models/listing";
import { Loan } from "@/models/loan";
import { NextRequest, NextResponse } from "next/server";
connectDB();

export async function GET(req: NextRequest) {
    try {
        const condition: { [key: string]: string } = {};
        const address = req.nextUrl.searchParams.get("address");
        if (address) {
            condition.account_address = address;
        }
        const forListingId = req.nextUrl.searchParams.get("for");
        if (forListingId) {
            condition.for = forListingId;
        }
        const data = await Loan.find(condition);
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
        const existListing = await Listing.findById(request.forListing);
        if(!existListing){
            throw new Error("Listing doesn't exist")
        }
        const exists = await Loan.findOne({
            object: request.object,
        });
        if (exists) {
            throw new Error("Same Loan Already Exists");
        }
        const newLoan = new Loan({
            address: request.address,
            forListing: request.forListing,
            coin: request.coin,
            amount: request.amount,
            duration: request.duration,
            apr: request.apr,
            offer_obj: request.offer_obj,
            hash: request.hash,
        });
        await newLoan.save();
        return NextResponse.json({ message: "success" }, { status: 200 });
    } catch (error: unknown) {
        let errorMessage = 'An unexpected error occurred';
        if (error instanceof Error) {
            errorMessage = error.message;
        }
        return NextResponse.json({ message: errorMessage }, { status: 500 });
    }
}