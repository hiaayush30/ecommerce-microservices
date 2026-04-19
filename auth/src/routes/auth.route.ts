import { Router } from "express";
import { createUser } from "../controllers/auth.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import { registerSchema } from "../validations/auth.validation.js";

const authRouter = Router();

authRouter.post("/register", validate(registerSchema), createUser);
// authRouter.post("/login");
// authRouter.post("/logout");
// authRouter.get("/me");
// authRouter.patch("/users/me");
// authRouter.get("/users/me/addresses")
// authRouter.post("/users/me/addresses")
// authRouter.delete("/users/me/addresses/:addressId")


export default authRouter;