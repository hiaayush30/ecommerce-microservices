import { Router } from "express";
import { createUser, login } from "../controllers/auth.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import { registerSchema, loginSchema } from "../validations/auth.validation.js";

const authRouter = Router();

authRouter.post("/register", validate(registerSchema), createUser);
authRouter.post("/login", validate(loginSchema), login);
// authRouter.post("/logout");
// authRouter.get("/me");
// authRouter.patch("/users/me");
// authRouter.get("/users/me/addresses")
// authRouter.post("/users/me/addresses")
// authRouter.delete("/users/me/addresses/:addressId")


export default authRouter;