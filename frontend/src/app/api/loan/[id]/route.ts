import { connectDB } from "@/lib/connect";
import { Listing } from "@/models/listing";
import { Loan } from "@/models/loan";
import { NextRequest, NextResponse } from "next/server";
connectDB();

type Params = {
    id: string
}

export async function PUT(req: NextRequest, context: { params: Params }) {
    try {
        const { id } = context.params;
        const status = req.nextUrl.searchParams.get("status");
        const exists = await Loan.findById(id);
        if(!exists){
            throw new Error("Loan doesn't exist");
        }
        // This api will only be used when onchain withdraw function is called
        if(status === "withdrawn"){
            exists.status = status;
            await exists.save();
        } // else bypass

        return NextResponse.json({ message: "success" }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}