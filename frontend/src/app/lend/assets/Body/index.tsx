"use client"
import { IListingSchema } from "@/models/listing"
import Image from "next/image"
import Link from "next/link"
interface BodyProps {
    data: IListingSchema[]
}
export function Body({ data }: BodyProps) {
    return (
        <section className="banner">
            <div className="container">
                <div className="row">
                    {data.map((token, index) => (
                        <div className="card" style={{ width: "18rem" }} key={index}>
                            <Image src={token.token_icon ?? "/nfts/1.jpeg"} className="card-img-top" alt="..." width={50} height={200} />
                            <div className="card-body">
                                <h5 className="card-title">{token.token_name}</h5>
                                <p className="card-text"></p>
                                <Link href={`/lend/${token._id}`}>Click me</Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}