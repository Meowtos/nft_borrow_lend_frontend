import { Aptos, AptosConfig, NetworkToNetworkName } from "@aptos-labs/ts-sdk";
import { movementIndexer, movementNetwork, movementRpc } from "../utils/env";

const aptosClient = new Aptos(
    new AptosConfig({
        network: NetworkToNetworkName[movementNetwork],
        fullnode: movementRpc,
        indexer: movementIndexer,
    })
)

