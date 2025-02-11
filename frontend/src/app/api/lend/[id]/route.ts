import { connectDB } from "@/libs/common";
import { Loan } from "@/models/loan";
import { NextRequest, NextResponse } from "next/server";
connectDB();

type Params = {
    id: string
}

export async function DELETE(req: NextRequest, context: { params: Params }) {
    try {
        const { id } = context.params;
        const exists = await Loan.findById(id);
        if(!exists){
            throw new Error("Loan doesn't exist");
        }
        exists.status = "withdrawn";
        await exists.save();
        return NextResponse.json({ message: "success" }, { status: 200 });
    } catch (error: unknown) {
        let errorMessage = 'An unexpected error occurred';
        if (error instanceof Error) {
            errorMessage = error.message;
        }
        return NextResponse.json({ message: errorMessage }, { status: 500 });
    }
}