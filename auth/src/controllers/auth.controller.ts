import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { userModel } from "../models/user.model.js";
import { z } from "zod";
import type { registerSchema } from "../validations/auth.validation.js";

type RegisterBody = z.infer<typeof registerSchema>['body']; // access the body property from the type

export const register = async (req: Request<{},{},RegisterBody>, res: Response) => {
    try {

        const { username, email, password, fullname } = req.body;

        // Check if user already exists
        const existingUser = await userModel.findOne({
            $or: [{ email }, { username }]
        });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "User already exists",
                error: "Email or username already registered"
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = await userModel.create({
            username,
            email,
            password: hashedPassword,
            fullname: {
                firstName: fullname.firstName,
                lastName: fullname.lastName
            }
        });

        // Remove password from response
        const userResponse = newUser.toObject();
        delete userResponse.password;

        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: userResponse
        });

    } catch (error: any) {
        console.error("Registration error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};
