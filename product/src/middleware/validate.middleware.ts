import type { NextFunction, Request, Response } from "express";
import type { ZodSchema } from "zod";

export const validationMiddleware = (schema: ZodSchema<any>) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const result = schema.safeParse({
            body: req.body,
            files: req.files
        });

        if (result.success) {
            // Update req.body with the preprocessed/transformed data
            req.body = result.data.body;
            next();
        } else {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: result.error.issues
            });
        }
    };
};
