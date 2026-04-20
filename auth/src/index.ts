import dotenv from "dotenv/config";
// dotenv.config();
import express from "express";
import { connectDb } from "./config/db.config.js";
import authRouter from "./routes/auth.route.js";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRouter);

app.all("/", (req, res) => {
    return res.json({
        success: true,
        message: "server running"
    })
})


const PORT = process.env.PORT || 3000;
connectDb()
    .then(() => {
        app.listen(PORT, () => {
            console.log("Process running on " + PORT);
        })
    })