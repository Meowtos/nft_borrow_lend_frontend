import { AptosConfig, NetworkToNetworkName, Aptos } from "@aptos-labs/ts-sdk";
import { NETWORK } from "./env";

export function getAptosClient(){
    const aptosConfig = new AptosConfig({ network: NetworkToNetworkName[NETWORK] });
    return new Aptos(aptosConfig);
}