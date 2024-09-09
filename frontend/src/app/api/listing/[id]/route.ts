import { connectDB } from "@/lib/connect";
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
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 })
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
            fa_metadata: request.fa_metadata,
            amount: request.amount,
            duration: request.duration,
            apr: request.apr,
        });
        
        return NextResponse.json({ data: exists })
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 })
    }
}