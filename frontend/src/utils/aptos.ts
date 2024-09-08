import { AptosConfig, NetworkToNetworkName, Aptos } from "@aptos-labs/ts-sdk";
import { NETWORK } from "./env";

const config = new AptosConfig({
    network: NetworkToNetworkName[NETWORK]
});
const aptos = new Aptos(config);
export const getUserOwnedCollections = async (ownerAddr: string) => {
    const result = await aptos.getAccountCollectionsWithOwnedTokens({
        accountAddress: ownerAddr,
    });
    console.log("my collections", result);
    return result;
};
export const getUserOwnedTokensByCollection = async(ownerAddr: string, collectionAddr: string) => {
    const result = await aptos.getAccountOwnedTokensFromCollectionAddress({
        accountAddress: ownerAddr,
        collectionAddress: collectionAddr,
    });
    console.log("my tokens", result);
    return result;
}