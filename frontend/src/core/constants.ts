import { NETWORK } from "@/utils/env";
import { Aptos, AptosConfig, NetworkToNetworkName } from "@aptos-labs/ts-sdk";

export const LocalStorageKeys = {
  keylessAccounts: "@aptos-connect/keyless-accounts",
};

export const aptosClient = new Aptos(
  new AptosConfig({ network: NetworkToNetworkName[NETWORK] })
);

/// FIXME: Put your client id here
export const GOOGLE_CLIENT_ID = "622805891406-40nob8shcauebm8tr67sdju9n68a74il.apps.googleusercontent.com";