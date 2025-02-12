import { SupraClient } from "supra-l1-sdk";
import { supraRpc } from "../utils/env";

const supraClient = new SupraClient(
    supraRpc
)