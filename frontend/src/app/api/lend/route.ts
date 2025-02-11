import { connectDB } from "@/libs/common";
import { Listing } from "@/models/listing";
import { Loan } from "@/models/loan";
import { User } from "@/models/user";
import { NextRequest, NextResponse } from "next/server";
connectDB();

export async function GET(req: NextRequest) {
    try {
        const condition: { [key: string]: string } = {};
        const address = req.nextUrl.searchParams.get("address");
        if (address) {
            condition.address = address;
        }
        const forListingId = req.nextUrl.searchParams.get("forListing");
        if (forListingId) {
            condition.forListing = forListingId;
        }
        const status = req.nextUrl.searchParams.get("status");
        if(status){
            condition.status = status;
        }
        const forAddress = req.nextUrl.searchParams.get("forAddress");
        if(forAddress){
            condition.forAddress = forAddress;
        }
        const data = await Loan.find(condition, "_id address coin amount duration apr offer_obj hash forListing status borrow_obj start_timestamp forAddress").populate("forListing");
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
            offer_obj: request.offer_obj,
        });
        if (exists) {
            throw new Error("Same Loan Already Exists");
        }
        const newLoan = new Loan({
            address: request.address,
            forAddress: existListing.address,
            forListing: request.forListing,
            coin: request.coin,
            amount: request.amount,
            duration: request.duration,
            apr: request.apr,
            offer_obj: request.offer_obj,
            hash: request.hash,
        });
        const user = await User.findOne({ address: existListing.address });
        await newLoan.save();
        return NextResponse.json({ message: "success", data: user?.isNotification ? user?.discordId : null }, { status: 200 });
    } catch (error: unknown) {
        let errorMessage = 'An unexpected error occurred';
        if (error instanceof Error) {
            errorMessage = error.message;
        }
        return NextResponse.json({ message: errorMessage }, { status: 500 });
    }
}