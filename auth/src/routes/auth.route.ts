import { Router } from "express";
import { createAddress, createUser, deleteAddress, getAddresses, getMe, login, logout, updateUser } from "../controllers/auth.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import { registerZodSchema, loginZodSchema, updateUserZodSchema } from "../validations/auth.validation.js";
import { protectedRoute } from "../middlewares/auth.middleware.js";
import { addressZodSchema } from "../validations/address.validation.js";

const authRouter = Router();

authRouter.post("/register", validate(registerZodSchema), createUser);
authRouter.post("/login", validate(loginZodSchema), login);
authRouter.post("/logout", logout);
authRouter.get("/me", protectedRoute, getMe);
authRouter.patch("/users/me", protectedRoute, validate(updateUserZodSchema), updateUser);
authRouter.get("/users/me/addresses", protectedRoute, getAddresses);
authRouter.post("/users/me/addresses", protectedRoute, validate(addressZodSchema), createAddress);
authRouter.delete("/users/me/addresses/:addressId", protectedRoute, deleteAddress);


export default authRouter;