import mongoose from "mongoose";
import { DB_CONNECTION_URI } from "./server.config.js";

export const connectDB = async () => {
    try {
        await mongoose.connect(DB_CONNECTION_URI!);
        console.log("db connected successfully");
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}