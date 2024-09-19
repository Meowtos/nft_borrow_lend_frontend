import { AptosConfig, NetworkToNetworkName, Aptos, TokenStandard } from "@aptos-labs/ts-sdk";
import { NETWORK } from "./env";
import { aptos as aptos_coin, punk_coin, moon_coin } from "./coins";
const config = new AptosConfig({
    network: NetworkToNetworkName[NETWORK]
});
export const aptos = new Aptos(config);
export const APR_DENOMINATOR = 10000;
export const MAX_LOCK_DURATION = 365;

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
                    _in: [aptos_coin, punk_coin, moon_coin]
                },
            },
        }
    });
    return result;
}

export const getAssetBalance = async (accountAddr: string, asset_type: string, token_standard: TokenStandard) => {
    if (token_standard === "v1") {
        const coinType = asset_type as '`${string}::${string}::${string}`';
        const result = await aptos.getAccountCoinAmount({ accountAddress: accountAddr, coinType });
        return result;
    } else {
        const result = await aptos.getCurrentFungibleAssetBalances({
            options: {
              where: {
                owner_address: {_eq: accountAddr},
                asset_type: {_eq: asset_type}
              }
            }
        });
        if(result.length === 0){
            return 0;
        }
        const primaryStore = result.find(store => store.is_primary === true);
        return primaryStore ? primaryStore.amount : 0        
    };
    return 0;
}

