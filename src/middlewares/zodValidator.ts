import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { ZodType } from "zod";
import { apiResponse } from "@/utils/apiResponse";

export function validate<T>(schema: ZodType<T>, readFrom: "body" | "query" = "body") {
    return (req: Request<{}, {}, {}, {}>, res: Response, next: NextFunction) => {
        const result = schema.safeParse(readFrom == "body" ? req.body : req.query);

        if (!result.success) {
            const errors = result.error.issues.map((e) => `${e.path} ${e.message}`);
            return apiResponse.error(res, `validation failed at ${readFrom}`, StatusCodes.BAD_REQUEST, errors);
        }
        if (readFrom === "body") {
            (req as Request<{}, {}, typeof result.data>).body = result.data;
        } else {
            Object.defineProperty(req, "query", {
                ...Object.getOwnPropertyDescriptor(req, "query"),
                value: req.query,
                writable: true
            });
            (req as Request<{}, {}, {}, typeof result.data>).query = result.data;
        }

        next();
    };
}
