import { Schema, model, models } from "mongoose";
export type BorrowStatus = "borrowed" | "repayed" | "broken";
export interface IBorrowSchema {
    _id: string;
    borrower: string;
    giver: string;
    for: Schema.Types.ObjectId;
    from: Schema.Types.ObjectId;
    status: BorrowStatus;
    object: string;
    tx_hash: string;
    created_at: Date;
    updated_at: Date;
}
const BorrowSchema = new Schema<IBorrowSchema>({
    borrower: {
        type: String,
        required: true
    },
    giver: {
        type: String,
        required: true
    },
    for: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Listing"
    },
    from: {
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
