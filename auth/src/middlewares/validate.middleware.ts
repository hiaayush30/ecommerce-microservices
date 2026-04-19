import { type Response, type NextFunction, type Request } from "express";
import { type AnyZodObject } from "zod/v3";

export const validate = (schema:AnyZodObject) => {
    return async (req:Request,res:Response,next:NextFunction) => {
            const validSchema = schema.safeParse(req);
            if(validSchema.success){
                next();
            } else {
                return res.status(403).json({
                    success:false,
                    message:"Invalid Request Body",
                    error:validSchema.error
                })
            }
    }
}