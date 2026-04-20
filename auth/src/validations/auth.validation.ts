import { z } from "zod/v3";

export const registerZodSchema = z.object({
    body: z.object({
        username: z.string().trim().toLowerCase().min(3).max(20),
        email: z.string().trim().email(),
        password: z.string().trim().min(3).max(20),
        fullname: z.object({
            firstName: z.string().trim().min(3).max(20),
            lastName: z.string().trim().min(3).max(20)
        })
    })
})

export const loginZodSchema = z.object({
    body: z.object({
        username: z.string().trim().toLowerCase().min(3).max(20).optional(),
        email: z.string().email().optional(),
        password: z.string().trim().min(3).max(20),
    })
})

export const updateUserZodSchema = z.object({
    body: z.object({
        fullname: z.object({
            firstName: z.string().trim().min(3).max(20).optional(),
            lastName: z.string().trim().min(3).max(20).optional()
        }).optional()
    })
})

export type RegisterInput = z.infer<typeof registerZodSchema>["body"];
export type LoginInput = z.infer<typeof loginZodSchema>["body"];
export type UpdateUserInput = z.infer<typeof updateUserZodSchema>["body"];