import { NextRequest, NextResponse } from "next/server";
import { Loan } from "@/models/loan";
import { User } from "@/models/user";
import { SERVER_URL } from "@/utils/env";

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
        const user = await User.findOne({ address: existLoan.address });
        if(user && user.discordId) {
            await fetch(`${SERVER_URL}/borrow/${user.discordId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    token_name: request.token_name,
                    token_icon: request.token_icon
                })
            });
        }
        return NextResponse.json({ message: "success" }, { status: 200 });
    } catch (error: unknown) {
        let errorMessage = 'An unexpected error occurred';
        if (error instanceof Error) {
            errorMessage = error.message;
        }
        return NextResponse.json({ message: errorMessage }, { status: 500 });
    }
}