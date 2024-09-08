"use client"

import { IListingSchema } from "@/models/listing"
import { useFormik } from "formik"
import Image from "next/image"
import * as Yup from "yup";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { toast } from "sonner";
import { APR_DENOMINATOR, aptos, APTOS_FA } from "@/utils/aptos";
import { ABI_ADDRESS } from "@/utils/env";

interface BodyProps {
    tokenListing: IListingSchema
}
export function Body({ tokenListing }: BodyProps) {
    const { account, signAndSubmitTransaction } = useWallet();
    const { values, handleSubmit, handleChange, errors } = useFormik({
        initialValues: {
            fa_metadata: "",
            amount: "",
            duration: "",
            apr: ""
        },
        validationSchema: Yup.object({
            fa_metadata: Yup.string().required("FA is required"),
            amount: Yup.number().required("Amount is required"),
            duration: Yup.string().required("Duration is required"),
            apr: Yup.number().required("APR is required")
        }),
        onSubmit: async(data) => {
            if(!account?.address) return;
            try {
                const apr = Number(data.apr) * APR_DENOMINATOR;
                const response = await signAndSubmitTransaction({
                    sender: account.address,
                    data: {
                        function: `${ABI_ADDRESS}::nft_lending::give_loan`,
                        typeArguments: [],
                        functionArguments: [
                            tokenListing.token_data_id,
                            data.fa_metadata,
                            data.amount,
                            data.duration,
                            apr 
                        ]
                    }
                });
                await aptos.waitForTransaction({
                    transactionHash: response.hash
                }).then(()=>{
                    toast.success("Offer given")
                })
            } catch (error: any) {
                console.log(error)
                toast.error(error.message)
            }
        }
    })
    return (
        <section className="banner">
            <div className="container">
                <div className="row">
                    <div className="card" style={{ width: "18rem" }} >
                        <Image src={tokenListing.token_icon ?? "/nfts/1.jpeg"} className="card-img-top" alt="..." width={50} height={200} />
                        <div className="card-body">
                            <h5 className="card-title">{tokenListing.token_name}</h5>
                            <p className="card-text"></p>
                        </div>
                    </div>
                </div>
                <form className="p-3 border" onSubmit={handleSubmit}>
                    <label>Select token</label>
                    <select className="form-select" name="fa_metadata" value={values.fa_metadata} onChange={handleChange}>
                        <option value={""}>None</option>
                        <option value={APTOS_FA}>Aptos</option>
                    </select>
                    <input type="text" name="amount" value={values.amount} onChange={handleChange} placeholder="Enter Amount" />
                    <label>Select lock duration</label>
                    <select className="form-select" name="duration" value={values.duration} onChange={handleChange}>
                        <option value="">None</option>
                        <option value="1">1 days</option>
                        <option value="2">2 days</option>
                    </select>
                    <input type="text" name="apr" value={values.apr} onChange={handleChange} />
                    <input type="submit" />
                </form>
            </div>
        </section>
    )
}