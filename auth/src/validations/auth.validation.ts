import { z } from "zod";

export const registerSchema = z.object({
    body: z.object({
        username: z.string().min(3).max(20),
        email: z.email(),
        password: z.string().min(3).max(20),
        fullname: z.object({
            firstName: z.string().min(3).max(20),
            lastName: z.string().min(3).max(20)
        })
    })
})