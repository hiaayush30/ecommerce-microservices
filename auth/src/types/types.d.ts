export type JwtPayload = {
    id: string,
    role: "user" | "seller",
    email: string,
    username: string
}