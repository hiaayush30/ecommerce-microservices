import { z } from "zod";

export const createProductSchema = z.object({
    body: z.object({
        title: z.string().min(3).max(100),
        description: z.string().min(10).max(1000),
        price: z.preprocess((val) => {
            if (typeof val === 'string') {
                try { return JSON.parse(val); } catch (e) { return val; }
            }
            return val;
        }, z.object({
            amount: z.number().positive(),
            currency: z.enum(["USD", "INR"]).default("INR")
        })),
        seller: z.string()
    }),
    files: z.array(z.any()).min(1, "At least one image is required")
});

export type CreateProduct = z.infer<typeof createProductSchema>["body"];
