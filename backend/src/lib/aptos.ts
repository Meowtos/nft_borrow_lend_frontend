import { Aptos, AptosConfig, NetworkToNetworkName } from "@aptos-labs/ts-sdk";
import { aptosNetwork } from "../utils/env";

const aptosClient = new Aptos(
    new AptosConfig({
        network: NetworkToNetworkName[aptosNetwork],
    })
)

