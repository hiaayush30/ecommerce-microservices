import { z } from "zod";

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