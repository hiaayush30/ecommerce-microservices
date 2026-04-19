import { z } from "zod/v3";

export const registerSchema = z.object({
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

export const loginSchema = z.object({
    body: z.object({
        username: z.string().trim().toLowerCase().min(3).max(20),
        password: z.string().trim().min(3).max(20),
    })
})

export type RegisterInput = z.infer<typeof registerSchema>["body"];
export type LoginInput = z.infer<typeof loginSchema>["body"];