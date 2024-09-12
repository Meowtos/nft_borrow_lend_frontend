import { IListingSchema } from "@/models/listing";

export interface Listing extends IListingSchema {

}

export interface Loan {
    _id: string;
    address: string;
    coin: string;
    amount: number;
    duration: number;
    apr: number;
    offer_obj: string;
    hash: string; 
    forListing: Listing,
}