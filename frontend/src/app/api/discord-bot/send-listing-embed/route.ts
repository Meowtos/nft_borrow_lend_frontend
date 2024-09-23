import { createEmbedMessage } from "@/utils/discord-api";
import { APIEmbed } from "discord.js";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest){
    try {
        const body = await req.json();
        const embed: APIEmbed = {
            title: body.title,
            description: body.desciption,
            image: body.image,
            url: body.url,
            timestamp: body.timestamp,
        };
        await createEmbedMessage(body.recepient_id, [embed]);
        return NextResponse.json({ message: "success" })
    } catch (error: unknown) {
        let errorMessage = 'An unexpected error occurred';
        if (error instanceof Error) {
            errorMessage = error.message;
        }
        return NextResponse.json({ message: errorMessage }, { status: 500 });
    }
}

