import axios from "axios";
import { storage } from "./storage";
import { Chain } from "./chain";

const api = axios.create({
    baseURL: `${process.env.BACKEND_URL}`,
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use(
    (config) => {
        const savedChain = storage.get("lend-borrow-chain");
        let chainName = "aptos";
        if(savedChain) {
            const chain = JSON.parse(savedChain) as Chain;
            if(chain.name === "aptos" || chain.name === "movement" || chain.name === "supra"){
                chainName = chain.name
            }
        }
        config.headers["x-chain"] = chainName;
        return config;
    },
    (error) => Promise.reject(error)
)
export type ListNFTData = {
    collection_id: string;
    token_id: string;
    name: string;
    uri: string;
    description: string;
    amount: number | undefined;
    duration: number | undefined;
    token_address: string | undefined;
    user: string;
}
async function listNFT(data: ListNFTData) {
    return (await api.post(`/v1/borrow/list`, data))
}
export type DelistNFTData = {
    user: string;
    token_id: string;
    collection_id: string;
}
async function delistNFT(data: DelistNFTData) {
    return (await api.delete(`/v1/borrow/delist?token_id=${data.token_id}&user=${data.user}&collection_id=${data.collection_id}`))
}
export interface NFTListing extends ListNFTData {
    id: number
}
async function getUserNFTListings(user: string) {
    return (await api.delete(`/v1/borrow/get-listing/${user}`));
}
async function getAllNFTListings() {
    return (await api.get(`/v1/borrow/get-listing`));
}
const backendApi = {
    listNFT,
    delistNFT,
    getUserNFTListings,
    getAllNFTListings
}
export default backendApi;