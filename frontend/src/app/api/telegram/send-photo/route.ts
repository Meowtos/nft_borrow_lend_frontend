import { TG_CHAT_ID } from "@/utils/env";
import { sendTgMessage } from "@/utils/telegram-api";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest){
    try {
        const body = await req.json();
        let caption = `🟩 🟩 🟩 🟩 🟩 🟩 🟩 🟩 🟩 🟩 🟩 🟩 🟩 🟩\n\nNew Listing on MeowFi\n\n<b>${body.title}</b>`
        if(body.amount){
            caption += `\n\nAmount - ${body.amount} ${body.coin ?? "Any Coin"}`
        } 
        if(body.apr){
            caption += `\n\nAPR - ${body.apr} %`

        }
        if(body.duration){
            caption += `\n\nLoan Duration - ${body.duration} days`
        }
        caption += `\n\n<a href="${body.url}">View Here</a>`;
        await sendTgMessage(TG_CHAT_ID, body.image, caption);
        return NextResponse.json({ message: "success" })
    } catch (error: unknown) {
        console.log(error)
        let errorMessage = 'An unexpected error occurred';
        if (error instanceof Error) {
            errorMessage = error.message;
        }
        return NextResponse.json({ message: errorMessage }, { status: 500 });
    }
}

