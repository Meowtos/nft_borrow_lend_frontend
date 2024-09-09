import { Schema, model, models } from "mongoose";
export type BorrowStatus = "borrowed" | "repayed" | "broken";
export interface IBorrowSchema {
    _id: string;
    borrower_address: string;
    giver_address: string;
    listing_id: Schema.Types.ObjectId;
    loan_id: Schema.Types.ObjectId;
    status: BorrowStatus;
    object: string;
    tx_hash: string;
    created_at: Date;
    updated_at: Date;
}
const BorrowSchema = new Schema<IBorrowSchema>({
    borrower_address: {
        type: String,
        required: true
    },
    giver_address: {
        type: String,
        required: true
    },
    listing_id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Listing"
    },
    loan_id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Loan"
    },
    status: {
        type: String,
        default: "borrowed"
    },
    object: {
        type: String,
        required: true
    },
    tx_hash: {
        type: String,
        required: true
    }
}, {
    timestamps: {
        createdAt: "created_at",
        updatedAt: "updated_at"
    }
})
export const Borrow = models.Borrow || model<IBorrowSchema>("Borrow", BorrowSchema);
