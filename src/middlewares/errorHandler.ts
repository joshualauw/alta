import { NextFunction, Request, Response } from "express";
import { ServiceError } from "@/lib/internal/errors";
import { apiResponse } from "@/utils/apiResponse";

export function errorHandler(err: unknown, req: Request, res: Response, next: NextFunction) {
    console.error(err);

    if (err instanceof ServiceError) {
        return apiResponse.error(res, err.message, err.statusCode);
    }

    return apiResponse.error(res, "Internal server error");
}
