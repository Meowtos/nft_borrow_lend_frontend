import { connectDB } from "@/lib/connect";
import { Loan } from "@/models/loan";
import { NextResponse } from "next/server";
connectDB();

export async function GET(req: Request) {
    try {
        const data = await Loan.find();
        return NextResponse.json({ message: "success", data }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
export async function POST(req: Request) {
    try {
        const request = await req.json();
        const exists = await Loan.findOne({
            object: request.object,
        })
        if (exists) {
            throw new Error("Loan exists");
        }
        const newListing = new Loan(request);
        await newListing.save();
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