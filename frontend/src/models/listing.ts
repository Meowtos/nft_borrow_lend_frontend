import { Schema, model, models } from "mongoose";
export type ListingStatus = "open" | "closed" | "accepted";
export interface IListingSchema {
    _id: string;
    account_address: string;
    collection_id: string;
    token_data_id: string;
    token_name: string;
    token_icon: string;
    fa_metadata: string | null;
    amount: number | null;
    duration: number | null;
    apr: number | null;
    status: ListingStatus;
    created_at: Date;
    updated_at: Date;
}
const ListingSchema = new Schema<IListingSchema>({
    account_address: {
        type: String,
        required: true
    },
    collection_id: {
        type: String,
        required: true
    },
    token_data_id: {
        type: String,
        required: true
    },
    token_name: {
        type: String,
        required: true,
    },
    token_icon: {
        type: String,
        required: true,
    },
    fa_metadata: {
        type: String,
        default: null,
    },
    amount: {
        type: Number,
        default: null,
    },
    duration: {
        type: Number,
        default: null,
    },
    apr: {
        type: Number,
        default: null,
    },
    status: {
        type: String,
        default: "open"
    }
}, {
    timestamps: {
        createdAt: "created_at",
        updatedAt: "updated_at"
    }
})
export const Listing = models.Listing || model<IListingSchema>("Listing", ListingSchema);
