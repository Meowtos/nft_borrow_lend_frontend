import { Schema, model, models } from "mongoose";
export type LoanStatus = "open" | "withdrawn" | "borrowed" | "repayed";
export interface ILoanSchema {
    _id: string;
    account_address: string;
    for: Schema.Types.ObjectId; // For which Listing
    fa_metadata: string;
    amount: number;
    duration: number;
    apr: number;
    status: LoanStatus;
    object: string;
    tx_hash: string; // creation tx hash
    created_at: Date;
    updated_at: Date;
}

const LoanSchema = new Schema<ILoanSchema>({
    account_address: {
        type: String,
        required: true
    },
    for: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Listing"
    },
    fa_metadata: {
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
        default: "open"
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
export const Loan = models.Loan || model<ILoanSchema>("Loan", LoanSchema);
