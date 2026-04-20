import { Router } from "express";
import { createUser, getMe, login, logout } from "../controllers/auth.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import { registerSchema, loginSchema } from "../validations/auth.validation.js";
import { protectedRoute } from "../middlewares/auth.middleware.js";

const authRouter = Router();

authRouter.post("/register", validate(registerSchema), createUser);
authRouter.post("/login", validate(loginSchema), login);
authRouter.post("/logout",logout);
authRouter.get("/me",protectedRoute,getMe);
// authRouter.patch("/users/me");
// authRouter.get("/users/me/addresses")
// authRouter.post("/users/me/addresses")
// authRouter.delete("/users/me/addresses/:addressId")


export default authRouter;