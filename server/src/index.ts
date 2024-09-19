import dotenv from "dotenv";
dotenv.config();
import express, { Request, Response } from "express"
const app = express();
app.use(express.json());
import cors from "cors";
app.use(cors());
import helmet from "helmet";
app.use(helmet())
const PORT = process.env.PORT || 8080;
import "./discord/client";
import { EmbedBuilder } from "discord.js";
import { sendDm, sendListing } from "./discord/embed";
app.get("/", (_req: Request, res: Response) => {
    return res.json({ status: "working" })
})
app.post("/new-listing", async(req: Request, res: Response) => {
    try {
        const request = req.body;
        const embed = new EmbedBuilder()
        .setTitle(`New Listing`)
        .setDescription(`${request.token_name} has been listed`)
        .setURL(`${process.env.CLIENT_URL}/lend/assets`)
        .setImage(request.token_icon)
        .setColor("Blue");
        await sendListing(embed);
        return res.json({ message: "success" })
    } catch (error: any) {
        return res.json({ message: error.message }).status(500)
    }
})

app.post("/new-offer/:userId", async(req: Request, res: Response) => {
    try {
        const userId = req.params.userId;
        const request = req.body;
        const embed = new EmbedBuilder()
        .setTitle(`New Loan offer received`)
        .setDescription(`A loan offer received on ${request.token_name}`)
        .setURL(`${process.env.CLIENT_URL}/borrow/offers`)
        .setImage(request.token_icon)
        .setColor("Blue");
        await sendDm(embed, userId);
        return res.json({ message: "success" })
    } catch (error: any) {
        return res.json({ message: error.message }).status(500)
    }
})

app.post("/borrow/:userId", async(req: Request, res: Response)=>{
    try {
        const userId = req.params.userId;
        const request = req.body;
        const embed = new EmbedBuilder()
        .setTitle(`Loan accepted`)
        .setDescription(`Your loan offer accepted for ${request.token_name}`)
        .setURL(`${process.env.CLIENT_URL}/lend/loans`)
        .setImage(request.token_icon)
        .setColor("Blue");
        await sendDm(embed, userId);
        return res.json({ message: "success" })
    } catch (error: any) {
        return res.json({ message: error.message }).status(500)
    }
})

app.post("/repay/:userId", async(req: Request, res: Response)=>{
    try {
        const userId = req.params.userId;
        const request = req.body;
        const embed = new EmbedBuilder()
        .setTitle(`Loan repayed`)
        .setDescription(`Your loan has been repayed for ${request.token_name}`)
        .setURL(`${process.env.CLIENT_URL}/lend/loans`)
        .setImage(request.token_icon)
        .setColor("Blue");
        await sendDm(embed, userId);
        return res.json({ message: "success" })
    } catch (error: any) {
        return res.json({ message: error.message }).status(500)
    }
})

app.get("*", (_req: Request, res: Response)=> {
    return res.json({ status: "not-found" }).status(404)
})

app.listen(PORT, ()=>{
    console.log(`[server]: started at http://localhost:${PORT}`)
})