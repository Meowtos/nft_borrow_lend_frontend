import { type Network } from "@aptos-labs/ts-sdk";
export const NETWORK = process.env.NEXT_PUBLIC_NETWORK as Network;
export const MONGO_URI = process.env.NEXT_PUBLIC_MONGO_URI as string;
export const ABI_ADDRESS = process.env.NEXT_PUBLIC_ABI_ADDRESS as string;