import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { userModel } from "../models/user.model.js";

interface RegisterRequestBody {
    username: string;
    email: string;
    password: string;
    fullname: {
        firstName: string;
        lastName: string;
    };
    role?: "user" | "seller";
}

export const register = async (req: Request<{}, {}, RegisterRequestBody>, res: Response) => {
    try {
        const { username, email, password, fullname, role } = req.body;

        // Validate required fields
        if (!username || !email || !password || !fullname?.firstName || !fullname?.lastName) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
                error: "Missing required fields"
            });
        }

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
            },
            role: role || "user"
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
