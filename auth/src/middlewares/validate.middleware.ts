import { type ZodObject, z } from 'zod';
import type { Request, Response, NextFunction } from 'express';

const validate = (schema: ZodObject) =>
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params,
            });
            next();
        } catch (error) {
            if (error instanceof z.ZodError) {
                return res.status(400).json({
                    success: false,
                    message: "All fields are required",
                    error: error.flatten().fieldErrors
                });
            }
            next(error);
        }
    };

export { validate }
