"use client"
import { ILoanSchema } from "@/models/loan";
import { aptos } from "@/utils/aptos";
import { ABI_ADDRESS } from "@/utils/env";
import { useWallet } from "@aptos-labs/wallet-adapter-react"
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
export function Body() {
    const { account, signAndSubmitTransaction } = useWallet();
    const [myLoans, setMyLoans] = useState<ILoanSchema[]>([])
    const fetchLoans = useCallback(async () => {
        if (!account?.address) return;
        fetch(`/api/loan?address=${account.address}`).then(async (res) => {
            const response = await res.json();
            setMyLoans(response.data)
        })
    }, [account?.address])
    const onWithdrawLoan = async(object: string) => {
        if(!account?.address) return;
        try {
            const response = await signAndSubmitTransaction({
                sender: account.address,
                data: {
                    function: `${ABI_ADDRESS}::nft_lending::withdraw_loan`,
                    typeArguments: [],
                    functionArguments: [
                        object
                    ]
                }
            });
            await aptos.waitForTransaction({
                transactionHash: response.hash
            });
            fetch("/api/loan", {
                method: "PUT",
                headers: {
                    contentType: "application/json"
                },
                body: JSON.stringify({
                    object,
                    status: "closed"
                })
            }).then(() => {
                fetchLoans()
                toast.success("Loan withdrawn successfully")
            }).catch((error) => {
                toast.error(error.message)
            })
            
        } catch (error) {
            console.error(error)
            toast.error(error as string)
        }
    }
    useEffect(() => {
        fetchLoans()
    }, [fetchLoans]);
    return (
        <section className="banner">
            <div className="container">
                <div className="row">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Amount</th>
                                <th>Apr</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                myLoans.map((loan, index) => (
                                    <tr key={index}>
                                        <td>{loan.amount}</td>
                                        <td>{loan.apr}</td>
                                        <td>{loan.status}</td>
                                        <td><button onClick={() => onWithdrawLoan(loan.object)}>Withdraw loan</button></td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    )
}