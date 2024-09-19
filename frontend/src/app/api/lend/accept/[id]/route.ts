import { NextRequest, NextResponse } from "next/server";
import { Loan } from "@/models/loan";
import { Listing } from "@/models/listing";
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
        if(existLoan.status !== "pending"){
            throw new Error("Loan status not pending to borrow")
        }
        if(existLoan.forAddress !== request.address){
            throw new Error("Cannot borrow this loan")
        }
        const existListing = await Listing.findById(existLoan.forListing);
        if(!existListing){
            throw new Error("Listing doesn't exist")
        }
        existLoan.status = "borrowed";
        existLoan.borrow_obj = request.borrow_obj;
        existLoan.start_timestamp = request.start_timestamp;
        await existLoan.save();
        existListing.status = "accepted";
        await existListing.save();
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