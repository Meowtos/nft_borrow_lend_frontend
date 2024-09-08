import { Schema, model } from "mongoose";
interface IListingSchema {
    token_id: String,
    token_name: String,
    token_icon: String,
    fa: String | null,
    amount: Number | null,
    duration: Number | null,
    apr: Number | null,
}
const ListingSchema = new Schema<IListingSchema>({
    token_id: {
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
    fa: {
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
})
export const ListingModel = model<IListingSchema>("listing", ListingSchema);
