import { AptosConfig, NetworkToNetworkName, Aptos } from "@aptos-labs/ts-sdk";
import { ABI_ADDRESS, NETWORK } from "./env";
const config = new AptosConfig({
    network: NetworkToNetworkName[NETWORK]
});
export const aptos = new Aptos(config);
export const APR_DENOMINATOR = 10000;
// Aptos and aptos pepe FA on devnet
export const APTOS = "0x000000000000000000000000000000000000000000000000000000000000000a";
export const APTOS_PEPE = "0xed26077894baf29ce90d490499544efc5cb7859fea33f46f0966cbfc48c5fcda";

export const getUserOwnedCollections = async (ownerAddr: string) => {
    const result = await aptos.getAccountCollectionsWithOwnedTokens({
        accountAddress: ownerAddr,
    });
    return result;
};
export const getUserOwnedTokensByCollection = async (ownerAddr: string, collectionAddr: string) => {
    const result = await aptos.getAccountOwnedTokensFromCollectionAddress({
        accountAddress: ownerAddr,
        collectionAddress: collectionAddr,
    });
    return result;
}
export const getFAMetadata = async () => {
    const result = await aptos.getFungibleAssetMetadata({
        options: {
            where: {
                asset_type: {
                    _in: [APTOS, APTOS_PEPE]
                },
                token_standard: {
                    _eq: "v2"
                }
            },

        }
    });
    return result;
}
// this function is specifically for nft lending events
export const getObjectAddressFromEvent = async (hash: string, eventName: string, objKey: string) => {
    const transaction = await aptos.getTransactionByHash({ transactionHash: hash });
    const eventType = `${ABI_ADDRESS}::nft_lending_events::${eventName}`;
    if (transaction.type === "user_transaction") {
        const event = transaction.events.find((event) => event.type === eventType);
        if (event) {
            return event.data[objKey];
        }
    }
    // This wont happen, everything must be correct above
    return "";
}
