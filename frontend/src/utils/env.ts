import { type Network } from "@aptos-labs/ts-sdk";
export const NETWORK = process.env.NEXT_PUBLIC_NETWORK as Network;
export const MONGO_URI = process.env.NEXT_PUBLIC_MONGO_URI as string;