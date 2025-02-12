import { Request, Response } from "express";
export default {
    async listNFT(req: Request, res: Response) {
        try {
            const chain = req.headers["x-chain"] ?? "aptos";
            const { 
                
            } = req.body;
            res.json({ data: "hash", message: "success" });

        } catch (error: any) {
            res.status(500).json({ message: error.message })
        }
    },
    async delistNFT(req: Request, res: Response) {
        try {
            const chain = req.headers["x-chain"] ?? "aptos";
            const { 
                
            } = req.body;
            res.json({ data: "hash", message: "success" });

        } catch (error: any) {
            res.status(500).json({ message: error.message })
        }
    },
    async updateListing(req: Request, res: Response) {
        try {
            const chain = req.headers["x-chain"] ?? "aptos";
            const { 
                
            } = req.body;
            res.json({ data: "hash", message: "success" });

        } catch (error: any) {
            res.status(500).json({ message: error.message })
        }
    },

    async getListingByUser(req: Request, res: Response) {
        try {
            const chain = req.headers["x-chain"] ?? "aptos";
            const { 
                
            } = req.body;
            res.json({ data: "hash", message: "success" });

        } catch (error: any) {
            res.status(500).json({ message: error.message })
        }
    },
    async getListing(req: Request, res: Response) {
        try {
            const chain = req.headers["x-chain"] ?? "aptos";
            const { 
                
            } = req.body;
            res.json({ data: "hash", message: "success" });

        } catch (error: any) {
            res.status(500).json({ message: error.message })
        }
    },
}