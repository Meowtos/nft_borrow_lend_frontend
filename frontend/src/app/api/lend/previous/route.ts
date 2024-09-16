import { connectDB } from "@/lib/connect";
import { Loan } from "@/models/loan";
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
        const forAddress = req.nextUrl.searchParams.get("forAddress");
        if(forAddress){
            condition.forAddress = forAddress;
        }
        const data = await Loan.find({ $or: [{ status: "repayed" }, { status: "grabbed" }], ...condition}, "_id address coin amount duration apr offer_obj hash forListing status borrow_obj start_timestamp forAddress").populate("forListing");
        return NextResponse.json({ message: "success", data }, { status: 200 });
    } catch (error: unknown) {
        let errorMessage = 'An unexpected error occurred';
        if (error instanceof Error) {
            errorMessage = error.message;
        }
        return NextResponse.json({ message: errorMessage }, { status: 500 });
    }
}
