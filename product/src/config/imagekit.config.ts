import ImageKit from "@imagekit/nodejs";
import dotenv from "dotenv";

dotenv.config();

export const imagekit = new ImageKit({
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY || "",
    baseURL: process.env.IMAGEKIT_URL_ENDPOINT || "https://api.imagekit.io"
});
