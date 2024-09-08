// connection with mongodb
import { MONGO_URI } from "@/utils/env";
import { connect } from "mongoose";
export const connectDB = async() => {
    await connect(MONGO_URI)
}