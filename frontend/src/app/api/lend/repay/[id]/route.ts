import { NextRequest, NextResponse } from "next/server";
import { Loan } from "@/models/loan";

type Params = {
    id: string
}
export async function PUT(req: NextRequest, context: { params: Params }){
    try {
        const id = context.params.id;
        const request = await req.json();
        const existLoan = await Loan.findById(id);
        if(!existLoan){
            throw new Error("Loan doesn't exist")
        }
        if(existLoan.status !== "borrowed"){
            throw new Error("Loan not borrowed yet")
        }
        if(existLoan.forAddress !== request.address){
            throw new Error("Cannot repay this loan")
        }
        existLoan.status = "repayed";
        await existLoan.save();
        return NextResponse.json({ message: "success" }, { status: 200 });
    } catch (error: unknown) {
        let errorMessage = 'An unexpected error occurred';
        if (error instanceof Error) {
            errorMessage = error.message;
        }
        return NextResponse.json({ message: errorMessage }, { status: 500 });
    }
}