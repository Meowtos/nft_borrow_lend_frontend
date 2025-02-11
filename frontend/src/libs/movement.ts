import { Aptos, AptosConfig, NetworkToNetworkName } from "@aptos-labs/ts-sdk";
import { WalletContextState } from "@razorlabs/razorkit"
export class MovementContract {
    abi: string = process.env.MOVEMENT_ABI!;
    wallet: WalletContextState;
    client: Aptos;
    constructor(wallet: WalletContextState) {
        const aptosConfig = new AptosConfig({
            network: NetworkToNetworkName[process.env.MOVEMENT_NETWORK || "custom"],
            fullnode: process.env.MOVEMENT_RPC,
            indexer: process.env.MOVEMENT_INDEXER,
        })
        this.client = new Aptos(aptosConfig)
        this.wallet = wallet;
    }

    async getWalletCollections(address: string) {
        const result = await this.client.getAccountCollectionsWithOwnedTokens({
            accountAddress: "0xc21eef93e0188165bc9f303e7f8b7f24064db5e6981d1cd092ee4a4b84ac38af",
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
            accountAddress: "0xc21eef93e0188165bc9f303e7f8b7f24064db5e6981d1cd092ee4a4b84ac38af",
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