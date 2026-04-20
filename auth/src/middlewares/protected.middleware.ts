import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import type { JwtPayload } from "../types/types.js";

export const protectedRoute = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { token } = req.cookies;
        if (!token) {
            return res.status(403).json({
                success: false,
                message: "authorization required"
            })
        }
        const { id, role, email, username } = jwt.verify(token, process.env.JWT_PASS!) as JwtPayload;
        req.id = id;
        req.role = role;
        req.email = email;
        req.username = username;
        next();

    } catch (error) {
        console.log(error);
        return res.status(403).json({
            success: false,
            message: "invalid token"
        })
    }
}