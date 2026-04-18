import type { Request, Response } from "express";
import { registerSchema } from "../validations/auth.validation.js";
import { User } from "../models/user.model.js";
import { createJwt, hashPassword } from "../utils/auth.util.js";

export const createUser = async (req: Request, res: Response) => {
    try {
        const validatedBody = registerSchema.safeParse(req);
        if (!validatedBody.success) {
            return res.status(403).json({
                success: false,
                message: "Invalid Request"
            });
        }
        const { email, fullname, password, username } = validatedBody.data.body;

        const existing = await User.findOne({
            $or: [
                { username },
                { email }
            ]
        });
        if (existing) {
            return res.status(403).json({
                success: false,
                message: "username already exists"
            })
        }
        const hashedPassword = await hashPassword(password);
        const user = await User.create({
            username, 
            fullname,
            email,
            password: hashedPassword
        })

        const token = createJwt({ _id: user._id, username });
        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none", 
            maxAge: 24 * 60 * 60 * 1000 // 1 day 
        });

        return res.status(201).json({
            success: true,
            message: "user created succeffully!"
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}