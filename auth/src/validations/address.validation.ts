import { z } from "zod/v3";

export const addressZodSchema = z.object({
    body: z.object({
        street: z.string(),
        city: z.string(),
        state: z.string(),
        country: z.string(),
        pincode: z.number()
    })
})

export type AddressInput = z.infer<typeof addressZodSchema>["body"]; 