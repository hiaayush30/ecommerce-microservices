import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import type { JwtPayload } from "../types/types.js";

export const protectedRoute = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { token } = req.cookies;
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "token not found"
            })
        }
        const user = jwt.verify(token, process.env.JWT_PASS!) as JwtPayload;
        req.user = user;
        next();

    } catch (error) {
        console.log(error);
        return res.status(403).json({
            success: false,
            message: "invalid token"
        })
    }
}