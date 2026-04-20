import type { NextFunction, Request, Response } from "express";
import { type LoginInput, type RegisterInput, type UpdateUserInput } from "../validations/auth.validation.js";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { comparePassword, hashPassword } from "../utils/auth.util.js";
import { redis } from "../config/redis.config.js";
import type { AddressInput } from "../validations/address.validation.js";

export const createUser = async (req: Request, res: Response) => {
    try {

        const { email, fullname, password, username, role } = req.body as RegisterInput;

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
            password: hashedPassword,
            role 
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
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
                fullname: user.fullname,
                role: user.role,
                addresses: user.addresses
            }
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}

export const login = async (req: Request, res: Response) => {
    try {
        const { password, username, email } = req.body as LoginInput;
        const queries = [];
        if (email) {
            queries.push({ email })
        }
        else if (username) {
            queries.push({ username })
        }
        else {
            return res.status(403).json({
                success: false,
                message: "username or email required"
            })
        }
        const user = await User.findOne({
            $or: queries
        }).select("+password");

        if (!user) {
            return res.status(403).json({
                success: false,
                message: "invalid credentials"
            })
        }
        const validPassword = await comparePassword(password, String(user.password));
        if (!validPassword) {
            return res.status(403).json({
                success: false,
                message: "invalid credentials"
            })
        }

        else {
            const token = jwt.sign(
                {
                    id: user._id, username, email: user.email, role: user.role
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

            return res.status(200).json({
                success: true,
                message: "logged in successfully!",
                user: {
                    _id: user._id,
                    username: user.username,
                    email: user.email,
                    fullname: user.fullname,
                    role: user.role,
                    addresses: user.addresses
                }
            })
        }

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}

export const getMe = async (req: Request, res: Response) => {
    try {
        const user = await User.findOne({ _id: req.user!.id });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "user not found"
            })
        }
        else {
            return res.status(200).json({
                success: true,
                message: "user fetched successfully",
                user
            })
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "internal server error"
        })
    }
}

export const logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies["token"];
        if (token) {
            await redis.set(`blacklist:${token}`, 'true', 'EX', 24 * 60 * 60); // entry expires in 1d (as the token also expires in 1d)
            res.clearCookie("token");
        }
        return res.status(200).json({
            success: true,
            message: "logged out successfully"
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "internal server error"
        })
    }
}


export const getAddresses = async (req: Request, res: Response) => {
    try {
        const user = await User.findOne({ _id: req.user!.id });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "user not found"
            })
        }
        else {
            return res.status(200).json({
                success: true,
                message: "addresses fetched successfully",
                addresses: user.addresses
            })
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "internal server error"
        })
    }
}

export const createAddress = async (req: Request, res: Response) => {
    try {
        const address = req.body as AddressInput;
        const user = await User.findOneAndUpdate({ _id: req.user!.id }, {
            $push: {
                addresses: address
            }
        }, { new: true })
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "user not found"
            })
        }
        return res.status(201).json({
            success: true,
            message: "address added successfully",
            addresses: user.addresses
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "internal server error"
        })
    }
}

export const deleteAddress = async (req: Request, res: Response) => {
    try {
        const { addressId } = req.params;
        if (!addressId) {
            return res.status(403).json({
                success: false,
                message: "address id required"
            })
        }

        const user = await User.findOne({ _id: req.user!.id });
        if (!user) {
            return res.status(403).json({
                success: false,
                message: "user not found"
            })
        }

        await User.updateOne(
            { _id: req.user!.id },
            { $pull: { addresses: { _id: addressId } } }
        );
        return res.status(200).json({
            success: true,
            message: "address deleted successfully"
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "internal server error"
        })
    }
}

export const updateUser = async (req: Request, res: Response) => {
    try {
        const input = req.body as UpdateUserInput;
        const user = await User.findOneAndUpdate({ _id: req.user!.id }, {
            ...input
        })
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "user not found"
            })
        }
        else {
            return res.status(200).json({
                success: true,
                message: "user updated successfully",
                user
            })
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "internal server error"
        })
    }
}