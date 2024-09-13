import { TokenStandard } from "@aptos-labs/ts-sdk";

export type FA = {
    asset_type: string;
    name: string;
    icon_uri: string;
    symbol: string;
    decimals: number;
    token_standard: TokenStandard;
}