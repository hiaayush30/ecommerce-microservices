import express from "express";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.routes.js";

const app = express();
app.use(cookieParser());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "server up and running"
    });
});

app.use("/auth", authRouter);

export default app;