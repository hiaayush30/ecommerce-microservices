import express from "express";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js";

const app = express();
app.use(cookieParser());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "server up and running",
        error: ""
    });
});

app.use("/auth", authRoutes);

export default app;