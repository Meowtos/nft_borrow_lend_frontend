import { connectDB } from "@/libs/common";
import { Listing } from "@/models/listing";
import { NextRequest, NextResponse } from "next/server";
connectDB();

type Params = {
    id: string
}

export async function GET(_req: NextRequest, context: { params: Params }){
    try {
        const id = context.params.id;
        const exists = await Listing.findById(id);
        if(!exists){
            throw new Error("Listing doesn't exist")
        }
        return NextResponse.json({ data: exists })
    } catch (error: unknown) {
        let errorMessage = 'An unexpected error occurred';
        if (error instanceof Error) {
            errorMessage = error.message;
        }
        return NextResponse.json({ message: errorMessage }, { status: 500 });
    }
}

export async function PUT(req: NextRequest, context: { params: Params }){
    try {
        const request = await req.json();
        const id = context.params.id;
        const exists = await Listing.findById(id);
        if(!exists){
            throw new Error("Listing doesn't exist")
        }
        // Send all of 'em in body (only these 4 can be updated)
        await Listing.updateOne({ _id: id }, {
            coin: request.coin,
            amount: request.amount,
            duration: request.duration,
            apr: request.apr,
        });
        
        return NextResponse.json({ data: exists })
    } catch (error: unknown) {
        let errorMessage = 'An unexpected error occurred';
        if (error instanceof Error) {
            errorMessage = error.message;
        }
        return NextResponse.json({ message: errorMessage }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, context: { params: Params }) {
    try {
        const address = req.nextUrl.searchParams.get("address");
        const id = context.params.id;
        const exists = await Listing.findById(id);
        if(!exists || address !== exists.address){
            throw new Error("Listing doesn't exist")
        }
        await Listing.findByIdAndDelete(id)
        return NextResponse.json({ message: "success" })
    } catch (error: unknown) {
        let errorMessage = 'An unexpected error occurred';
        if (error instanceof Error) {
            errorMessage = error.message;
        }
        return NextResponse.json({ message: errorMessage }, { status: 500 });
    }
}