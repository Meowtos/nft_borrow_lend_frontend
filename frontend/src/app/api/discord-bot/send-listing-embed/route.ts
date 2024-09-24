import { project } from "@/utils/constants";
import { createEmbedMessage } from "@/utils/discord-api";
import { APIEmbed, EmbedField } from "discord.js";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest){
    try {
        const body = await req.json();
        const fields: EmbedField[] = [];
        if(body.amount){
            fields.push(  {
                name: "Amount",
                value: body.amount ? `${body.amount} ${body.coin ?? "Any coin"}` : "N/A",
                inline: true,
            })
        }
        if(body.apr){
            fields.push({
                name: "Apr",
                value: body.apr ? `${body.apr} %` : "N/A",
                inline: true,
            })
        }
        if(body.duration){
            fields.push( {
                name: "Duration",
                value: body.duration ? `${body.duration} days` : "N/A",
                inline: true,
            })
        }
        const embed: APIEmbed = {
            title: body.title,
            image: { url: body.image },
            url: body.url,
            color: 255,
            fields,
            footer: {
                text: project,
            },
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

