import { connectDB } from "@/lib/connect";
import { Borrow } from "@/models/borrow";
import { Listing } from "@/models/listing";
import { Loan } from "@/models/loan";
import { NextRequest, NextResponse } from "next/server";
connectDB();

export async function GET(req: NextRequest) {
    try {
        const address = req.nextUrl.searchParams.get("address");
        const userListings = await Listing.find({
            account_address: address,
            status: "open"
        }, "_id");
        if(userListings.length === 0){
            throw new Error("No open listings")
        }
        const condition: any = userListings.map(v =>  { return { listing_id: v._id.toString() }});
        const data = await Loan.find({$or: condition});
        return NextResponse.json({ message: "success", data }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
export async function POST(req: Request) {
    try {
        const request = await req.json();
        const exists = await Borrow.findOne({
            object: request.object,
        })
        if (exists) {
            throw new Error("Borrow exists");
        }
        const loan = await Loan.findOne({
            object: request.loan
        }).populate("Listing");
        if(!loan){
            throw new Error("Loan doesnt exist")
        }
        const newBorrow = new Borrow();
        await newBorrow.save();
        return NextResponse.json({ message: "success" }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const request = await req.json();
        const exists = await Loan.findOne({
            object: request.object,
        })
        if (!exists) {
            throw new Error("Loan doesnt exists");
        }
        exists.status = request.status;
        await exists.save();
        return NextResponse.json({ message: "success" }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}