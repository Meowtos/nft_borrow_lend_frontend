import { IListingSchema } from "@/models/listing";
import { LoanStatus } from "@/models/loan";

export interface Listing extends IListingSchema {

}

export interface Loan {
    _id: string;
    forAddress: string;
    address: string;
    coin: string;
    amount: number;
    duration: number;
    apr: number;
    offer_obj: string;
    hash: string; 
    forListing: Listing;
    status: LoanStatus;
    start_timestamp: number | null;
    borrow_obj: string | null;
}