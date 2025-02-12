import dotenv from "dotenv";
dotenv.config()
import express, { Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import http from "http";
import { port } from "./utils/env";
import { baseRoutes } from "./routes/base-routes";

const app = express();
app.use(express.json());
app.use(helmet());
app.use(cors());

app.get("/", (req: Request, res: Response)=>{
    res.json({ status: "working", app: "MeowFi" })
})
app.use("/v1", baseRoutes);
app.use("*", (req: Request, res: Response)=>{
    res.status(404).json({ status: "not found" })
})

const server = http.createServer(app);
server.listen(port, function(){
    console.log(`server started at http://localhost:${port}`)
})