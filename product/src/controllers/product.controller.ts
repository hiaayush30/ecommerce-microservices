import type { Request, Response } from "express";
import { Product } from "../models/product.model.js";
import type { CreateProduct } from "../validations/product.validation.js";
import { imagekit } from "../config/imagekit.config.js";
import ImageKit from "@imagekit/nodejs";

export const createProduct = async (req: Request, res: Response) => {
    try {
        const { title, description, price, seller } = req.body as CreateProduct;
        const files = req.files as Express.Multer.File[];

        const uploadPromises = files.map(async (file) => {
            const fileToUpload = await ImageKit.toFile(file.buffer, file.originalname);
            return imagekit.files.upload({
                file: fileToUpload,
                fileName: `${Date.now()}-${file.originalname}`,
                folder: "/products"
            });
        });

        const uploadResults = await Promise.all(uploadPromises);
        console.log("uploadResults")
        console.log(uploadResults);

        const images = uploadResults.map(result => ({
            url: result.url || "",
            thumbnail: result.thumbnailUrl || "",
            id: result.fileId || ""
        }));
        console.log("images")
        console.log(images)

        const product = new Product({
            title,
            description,
            price,
            seller,
            images
        });

        await product.save();

        res.status(201).json({
            success: true,
            message: "Product created successfully",
            product
        });

    } catch (error: any) {
        console.error("Error creating product:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};
