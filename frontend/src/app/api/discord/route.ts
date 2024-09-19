import { connectDB } from "@/lib/connect";
import { User } from "@/models/user";
import { NextRequest, NextResponse } from "next/server";
connectDB();

export async function GET(req: NextRequest){
    try {
        const address = req.nextUrl.searchParams.get("address");
        if(!address){
            throw new Error("Pass address in query")
        }
        const user = await User.findOne({ address });
        if(!user){
            throw new Error("User not registered")
        }

        return NextResponse.json({ data: user }, { status: 200 });
    } catch (error: unknown) {
        let errorMessage = 'An unexpected error occurred';
        if (error instanceof Error) {
            errorMessage = error.message;
        }
        return NextResponse.json({ message: errorMessage }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const { address, discordId, discordUsername } = await req.json();
        const idExists = await User.findOne({ discordId });
        if(idExists){
            throw new Error("Discord account already linked with another wallet");
        }
        const userExists = await User.findOne({ address });
        if(userExists){
            userExists.discordId = discordId;
            userExists.discordUsername = discordUsername;
            await userExists.save();
        } else {
            const user =  new User({
                address,
                discordId,
                discordUsername,
            });
            await user.save();
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
// Update discord notification
export async function PUT(req: NextRequest) {
    try {
        const address = req.nextUrl.searchParams.get("address");
        if(!address){
            throw new Error("Pass address in query")
        }
        const user = await User.findOne({ address });
        if(!user){
            throw new Error("User not registered")
        }
        user.isNotification = !user.isNotification;
        await user.save();
        return NextResponse.json({ message: "success" }, { status: 200 });
    } catch (error: unknown) {
        let errorMessage = 'An unexpected error occurred';
        if (error instanceof Error) {
            errorMessage = error.message;
        }
        return NextResponse.json({ message: errorMessage }, { status: 500 });
    }
}