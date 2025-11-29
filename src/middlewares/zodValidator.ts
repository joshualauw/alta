import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { ZodObject } from "zod";
import { apiResponse } from "@/utils/apiResponse";

export function validate(schema: ZodObject, readFrom: "body" | "query" = "body") {
    return (req: Request, res: Response, next: NextFunction) => {
        const result = schema.safeParse(readFrom == "body" ? req.body : req.query);

        if (!result.success) {
            const errors = result.error.issues.map((e) => `${e.path} ${e.message}`);
            return apiResponse.error(res, `validation failed at ${readFrom}`, StatusCodes.BAD_REQUEST, errors);
        }

        req.body = result.data;

        next();
    };
}
