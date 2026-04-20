import mongoose from "mongoose";

export const connectDb = async () => {
    try {
        await mongoose.connect(process.env.DB_CONNECTION_URI!);
        console.log("DB connected");
    } catch (error) {
        console.error("DB connection failed:" + error);
        process.exit(1);
    }
}