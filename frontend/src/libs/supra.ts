import { StarkeyProvider } from "@/types/starkey";
import { SupraClient } from "supra-l1-sdk"

export class SupraContract{
    abi: string = process.env.SUPRA_ABI!;
    wallet: StarkeyProvider;
    client: SupraClient;
    constructor(wallet: StarkeyProvider) {
        this.wallet = wallet
        this.client = new SupraClient(
            process.env.SUPRA_RPC || "https://rpc-testnet.supra.com"
        )
    }
}
