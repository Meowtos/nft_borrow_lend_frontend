"use client";

import { Loan } from "@/types/ApiInterface";
import Image from "next/image";
import { IoClose } from "react-icons/io5";
import { MdCollections, MdOutlineToken } from "react-icons/md";

export const acceptOfferModalId = "acceptOffeModal";
interface AcceptModalProps {
    offer: Loan | null
}
export function AcceptModal({ offer }: AcceptModalProps) {
    return (
        <div className="modal fade" id={acceptOfferModalId} tabIndex={-1} aria-labelledby={`${acceptOfferModalId}Label`} >
            <div className="modal-dialog modal-dialog-centered modal-xl">
                <div className="modal-content list-modal">
                    <IoClose type="button" className="text-light close-icon" data-bs-dismiss="modal" aria-label="Close" id="closeacceptOfferModal" />
                    {
                        offer &&
                        <div className="row">
                            <div className="col-lg-3 p-0">
                                <div className="nft">
                                    <Image src={offer.forListing.token_icon} className="asset-img" alt={offer.forListing.token_name} width={150} height={200} />
                                </div>
                                <div className="nft-details">
                                    <h4 className="text-center">{offer.forListing.token_name}</h4>
                                    <p><MdCollections className="text-light" /> {offer.forListing.collection_name}</p>
                                    <p><MdOutlineToken className="text-light" />{offer.forListing.token_standard}</p>
                                </div>
                            </div>
                            <div className="col-lg-9 p-0 ps-5">
                                <h3>Asset Offer Accept</h3>
                                <p className="mt-4 notice"><strong>Notice:</strong> By selecting this NFT as collateral, you acknowledge that the NFT will be securely transferred and stored with us for the duration of the loan. You will not have access to this NFT until the loan is fully repaid.</p>
                            </div>
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}