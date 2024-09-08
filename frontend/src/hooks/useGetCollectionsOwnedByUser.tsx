import { getUserOwnedCollections } from "@/utils/aptos";
import { useEffect, useState } from "react";

export const useGetCollectionsOwnedByUser = (ownerAddr: string) => {
  const [collections, setCollections] = useState<any>();
  useEffect(() => {
    getUserOwnedCollections(ownerAddr).then(async (res) => {
        setCollections(res)
    });
  }, [ownerAddr]);
  return collections;
};
