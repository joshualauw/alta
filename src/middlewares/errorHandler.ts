import { NextFunction, Request, Response } from "express";
import { apiResponse } from "@/utils/apiResponse";

export class ServiceError extends Error {
    statusCode: number;

    constructor(message: string, statusCode: number) {
        super(message);
        this.name = "ServiceError";
        this.statusCode = statusCode;

        Object.setPrototypeOf(this, ServiceError.prototype);
    }
}

export function errorHandler(err: unknown, req: Request, res: Response, next: NextFunction) {
    console.error(err);

    if (err instanceof ServiceError) {
        return apiResponse.error(res, err.message, undefined, err.statusCode);
    }

    return apiResponse.error(res, "Internal server error");
}
