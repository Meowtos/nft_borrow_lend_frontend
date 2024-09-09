import { connectDB } from "@/lib/connect";
import { Borrow } from "@/models/borrow";
import { Loan } from "@/models/loan";
import { NextRequest, NextResponse } from "next/server";
connectDB();

type Params = {
    id: string
}

export async function POST(req: NextRequest, context: { params: Params }) {
    try {
        const { id } = context.params;
        const request = await req.json();
        const existLoan = await Loan.findById(id).populate("for");
        console.log(existLoan)
        if(!existLoan){
            throw new Error("Loan doesn't exist");
        }
        const exists = await Borrow.findOne({ object: request.object });
        if(exists){
            throw new Error("Same borrow already exists")
        }
        // const newBorrow = new Borrow({
        //     borrower: 
        // })

        return NextResponse.json({ message: "success" }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}