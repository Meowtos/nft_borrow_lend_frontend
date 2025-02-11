"use client"
import { useApp } from "@/context/AppProvider"
import { AptosWalletButton } from "./AptosWalletButton";
import { MovementWalletButton } from "./MovementWalletButton";
import { SupraWalletButton } from "./SupraWalletButton";
export function Wallets() {
    const { chain } = useApp();
    if(chain.name === "aptos") return <AptosWalletButton />;
    if(chain.name === "movement") return <MovementWalletButton />;
    if(chain.name === "supra") return <SupraWalletButton />
}