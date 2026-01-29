import express from "express";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.routes.js";

const app = express();
app.use(cookieParser());
app.use(express.json());

app.get("/api/v1", (req, res) => {
    res.json({
        success: true,
        message: "server up and running"
    });
});

app.use("/api/v1/auth", authRouter);

export default app;