import type { Request, Response } from "express";
import { registerSchema, type RegisterInput } from "../validations/auth.validation.js";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { hashPassword } from "../utils/auth.util.js";

export const createUser = async (req: Request, res: Response) => {
    try {

        const { email, fullname, password, username } = req.body as RegisterInput;

        const existing = await User.findOne({
            $or: [
                { username },
                { email }
            ]
        });
        if (existing) {
            return res.status(409).json({
                success: false,
                message: "user already exists"
            })
        }
        const hashedPassword = await hashPassword(password);
        const user = await User.create({
            username,
            fullname,
            email,
            password: hashedPassword
        })

        const token = jwt.sign(
            {
                id: user._id, username, email, role: user.role
            },
            process.env.JWT_PASS!,
            {
                expiresIn: '1d'
            }
        );
        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "none",
            maxAge: 24 * 60 * 60 * 1000 // 1 day 
        });

        return res.status(201).json({
            success: true,
            message: "user created successfully!",
            user
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}