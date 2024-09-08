import { getUserOwnedTokensByCollection } from "@/utils/aptos";
import { useEffect, useState } from "react";

export const useGetUserOwnedTokensByCollection = (ownerAddr: string, collectionAddr: string) => {
  const [tokens, setTokens] = useState<any[]>([]);
  useEffect(() => {
    getUserOwnedTokensByCollection(ownerAddr, collectionAddr).then(async (res) => {
        setTokens(res)
    });
  }, [ownerAddr, collectionAddr]);
  return tokens;
};
