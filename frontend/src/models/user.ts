import { Schema, model, models } from "mongoose";
export interface IUserSchema {
    address: string;
    discordId: number | null,
    discordUsername: string | null,
    isNotification: boolean,
}

const UserSchema = new Schema<IUserSchema>({
    address: {
        type: String,
        required: true
    },
    discordId: {
        type: Number,
        default: null,
    },
    discordUsername: {
        type: String,
        default: null,
    },
    isNotification: {
        type: Boolean,
        default: true,
    },
}, {
    timestamps: {
        createdAt: "created_at",
        updatedAt: "updated_at"
    }
})
export const User = models.User || model<IUserSchema>("User", UserSchema);
