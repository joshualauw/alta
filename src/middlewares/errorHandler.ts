import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { PrismaClientValidationError } from "@/database/generated/prisma/internal/prismaNamespace";
import { ServiceError } from "@/lib/internal/errors";
import { apiResponse } from "@/utils/apiResponse";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";

export function errorHandler(err: unknown, req: Request, res: Response, _: NextFunction) {
    console.error(err);

    if (err instanceof ServiceError) {
        return apiResponse.error(res, err.message, err.statusCode);
    }

    if (err instanceof PrismaClientKnownRequestError) {
        switch (err.code) {
            case "P2002":
                return apiResponse.error(res, "duplicated value", StatusCodes.CONFLICT);
            case "P2025":
                return apiResponse.error(res, "record not found", StatusCodes.NOT_FOUND);
            case "P2003":
                return apiResponse.error(res, "invalid foreign key reference", StatusCodes.BAD_REQUEST);
            default:
                return apiResponse.error(res, "database error", StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    if (err instanceof PrismaClientValidationError) {
        return apiResponse.error(res, "invalid data", StatusCodes.UNPROCESSABLE_ENTITY);
    }

    return apiResponse.error(res, "internal server error");
}
