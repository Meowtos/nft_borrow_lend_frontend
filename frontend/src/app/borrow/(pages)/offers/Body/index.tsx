"use client"
import { ILoanSchema } from "@/models/loan";
import { aptos, getObjectAddressFromEvent } from "@/utils/aptos";
import { ABI_ADDRESS } from "@/utils/env";
import { useWallet } from "@aptos-labs/wallet-adapter-react"
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
export function Body() {
    const { account, signAndSubmitTransaction } = useWallet();
    const [offers, setOffers] = useState<ILoanSchema[]>([])
    const fetchOffers = useCallback(async () => {
        if (!account?.address) return;
        fetch("/api/listing?address=" + account.address).then(async (res) => {
            const response = await res.json();
            if (res.ok) {
                setOffers(response.data);
            }
        })
    }, [account?.address]);
    const onBorrow = async (object: string) => {
        if (!account?.address) return;
        const response = await signAndSubmitTransaction({
            sender: account.address,
            data: {
                function: `${ABI_ADDRESS}::nft_lending::borrow`,
                typeArguments: [],
                functionArguments: [
                    object
                ]
            }
        });
        await aptos.waitForTransaction({
            transactionHash: response.hash
        })
        const borrowObject = await getObjectAddressFromEvent(response.hash, `BorrowEvent`, `borrow_object`);
        fetch("/api/borrow", {
            method: "POST",
            headers: {
                contentType: "application/json"
            },
            body: JSON.stringify({
                object: borrowObject,
                loan: object
            })
        }).then(() => {
            toast.success("borrow success")
        }).catch((error) => {
            toast.error(error.message)
        })
    }
    useEffect(() => {
        fetchOffers()
    }, [fetchOffers])
    return (
        <table className="table">
            <thead>
                <tr>
                    <th>Amount</th>
                    <th>Apr</th>
                    <th className="text-end">Status</th>
                    <th className="text-end">Action</th>
                </tr>
            </thead>
            <tbody>
                {
                    offers.length > 0 ? (
                        offers.map((loan, index) => (
                            <tr key={index}>
                                <td>{loan.amount}</td>
                                <td>{loan.apr}</td>
                                <td className="text-end">
                                    <p className="off-status accepted">{loan.status}</p>
                                </td>
                                <td className="text-end">
                                    <button className="action-btn rounded" onClick={() => onBorrow(loan.object)}>Accept offer</button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={4} className="text-center"><p className="p-3">No offers</p></td>
                        </tr>
                    )
                }
                <tr>
                    <td>25 APT</td>
                    <td>30%</td>
                    <td className="text-end">
                        <p className="off-status ended">ended</p>
                    </td>
                    <td className="text-end"><button className="action-btn rounded">Accept offer</button></td>
                </tr>
                <tr>
                    <td>25 APT</td>
                    <td>30%</td>
                    <td className="text-end">
                        <p className="off-status accepted">accepted</p>
                    </td>
                    <td className="text-end"><button className="action-btn rounded">Accept offer</button></td>
                </tr>
                <tr>
                    <td>25 APT</td>
                    <td>30%</td>
                    <td className="text-end">
                        <p className="off-status live">live</p>
                    </td>
                    <td className="text-end"><button className="action-btn rounded">Accept offer</button></td>
                </tr>
                <tr>
                    <td>25 APT</td>
                    <td>30%</td>
                    <td className="text-end">
                        <p className="off-status live">live</p>
                    </td>
                    <td className="text-end"><button className="action-btn rounded">Accept offer</button></td>
                </tr>
            </tbody>
        </table>
    )
}