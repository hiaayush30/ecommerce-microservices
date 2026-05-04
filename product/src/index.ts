import dotenv from "dotenv";
dotenv.config();
import express from "express";
import { connectDb } from "./config/db.config.js";
import cookieParser from "cookie-parser";
import productRouter from "./routes/product.route.js";

const app = express();
app.use(express.json());
app.use(cookieParser());

app.all("/", (req, res) => {
    return res.status(200).json({
        success: true,
        message: "server running"
    })
})

app.use("/api/product",productRouter);

const port = process.env.PORT || 5001;
connectDb()
    .then(() => {
        app.listen(port, () => {
            console.log("server running on port: " + port)
        })
    })