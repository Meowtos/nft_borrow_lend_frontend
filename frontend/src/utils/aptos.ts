import { AptosConfig, NetworkToNetworkName, Aptos, Account } from "@aptos-labs/ts-sdk";
import { NETWORK } from "./env";
const config = new AptosConfig({
    network: NetworkToNetworkName[NETWORK]
});
export const aptos = new Aptos(config);
export const APR_DENOMINATOR = 10000;
export const APTOS_FA = "0x000000000000000000000000000000000000000000000000000000000000000a";
export const getUserOwnedCollections = async (ownerAddr: string) => {
    const result = await aptos.getAccountCollectionsWithOwnedTokens({
        accountAddress: ownerAddr,
    });
    return result;
};
export const getUserOwnedTokensByCollection = async(ownerAddr: string, collectionAddr: string) => {
    const result = await aptos.getAccountOwnedTokensFromCollectionAddress({
        accountAddress: ownerAddr,
        collectionAddress: collectionAddr,
    });
    return result;
}
interface GiveLoanParams {
    
}
// export const giveLoan = async(
//     sender: AccountInfo,
//     token_id: string,
//     fa_metadata: string,
//     amount: number,
//     duration: string,
//     apr: number,
// ) => {
//     const rawTxn = await aptos.transaction.build.simple({
//         sender: sender.address,
//         data: {
//           function: `${ABI_ADDRESS}::nft_lending::give_loan`,
//           functionArguments: [token_id, fa_metadata, amount, duration, apr],
//         },
//       });
//       const pendingTxn = await aptos.signAndSubmitTransaction({
//         signer: sender,
//         transaction: rawTxn,
//       });
//       const response = await aptos.waitForTransaction({
//         transactionHash: pendingTxn.hash,
//       });
//       console.log("loan created. - ", response.hash);
// }