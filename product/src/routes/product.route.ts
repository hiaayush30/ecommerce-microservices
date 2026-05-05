import { Router } from "express";
import { createProduct } from "../controllers/product.controller.js";
import { upload } from "../middleware/multer.middleware.js";
import { validationMiddleware } from "../middleware/validate.middleware.js";
import { createProductSchema } from "../validations/product.validation.js";

const productRouter = Router();

productRouter.post("/", upload.array("images", 5), validationMiddleware(createProductSchema), createProduct);

export default productRouter;