import { queryFetchWalletItemsAptos } from "@/graphql/queryFetchWalletItems";
import { Aptos, AptosConfig, NetworkToNetworkName } from "@aptos-labs/ts-sdk";
import { WalletContextState } from "@aptos-labs/wallet-adapter-react";
import axios from "axios"
import { headers } from "next/headers";

export class AptosContract {
    abi: string = process.env.APTOS_ABI!;
    wallet: WalletContextState;
    client: Aptos;
    constructor(wallet: WalletContextState) {
        const aptosConfig = new AptosConfig({
            network: NetworkToNetworkName[process.env.APTOS_NETWORK || "devnet"]
        })
        this.client = new Aptos(aptosConfig)
        this.wallet = wallet;
    }

    async getWalletCollections(address: string) {
        const result = await this.client.getAccountCollectionsWithOwnedTokens({
            accountAddress: address,
        });
        return result.map((res) => {
            return {
                id: res.collection_id,
                name: res.collection_name,
                uri: res.collection_uri,
                description: res.current_collection?.description || "",
            }
        })
    }

    async getNFTByCollection(id: string, address: string) {
            const result = await this.client.getAccountOwnedTokensFromCollectionAddress({
                collectionAddress: id,
                accountAddress: address,
            });
            return result.map((token) => {
                return {
                    id: token.token_data_id,
                    name: token.current_token_data?.token_name || "",
                    uri: token.current_token_data?.token_uri,
                    description: token.current_token_data?.description,
                    properties: token.current_token_data?.token_properties
                }
            });
    }

}