import dotenv from "dotenv";

dotenv.config();

export const PORT = process.env.PORT;
export const DB_CONNECTION_URI = process.env.DB_CONNECTION_URI;