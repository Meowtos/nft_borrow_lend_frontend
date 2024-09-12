import { Schema, model, models } from "mongoose";
export type LoanStatus = "pending" | "cancelled" | "borrowed" | "repayed";
export interface ILoanSchema {
    _id: string;
    address: string;
    forListing: Schema.Types.ObjectId; // For which Listing
    coin: string;
    amount: number;
    duration: number;
    apr: number;
    status: LoanStatus;
    offer_obj: string;
    hash: string; // creation tx hash
    created_at: Date;
    updated_at: Date;
}

const LoanSchema = new Schema<ILoanSchema>({
    address: {
        type: String,
        required: true
    },
    forListing: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Listing"
    },
    coin: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    duration: {
        type: Number,
        required: true,
    },
    apr: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        default: "pending"
    },
    offer_obj: {
        type: String,
        required: true
    },
    hash: {
        type: String,
        required: true
    }
}, {
    timestamps: {
        createdAt: "created_at",
        updatedAt: "updated_at"
    }
})
export const Loan = models.Loan || model<ILoanSchema>("Loan", LoanSchema);
