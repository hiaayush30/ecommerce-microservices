import express from "express";
import { PORT } from "./config/server.config.js";
import cookieParser from "cookie-parser";
import { connectDB } from "./config/db.config.js";

const app = express();
app.use(cookieParser());
app.use(express.json());


app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "server up and running",
        error: ""
    })
})

connectDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log("server running on " + PORT)
        })
    })