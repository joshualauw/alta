import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { PrismaClientValidationError } from "@/database/generated/prisma/internal/prismaNamespace";
import { ServiceError } from "@/lib/internal/errors";
import { apiResponse } from "@/utils/apiResponse";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";
import config from "@/config";

export function errorHandler(err: unknown, req: Request, res: Response, _: NextFunction) {
    if (config.nodeEnv != "test") {
        console.error(err);
    }

    if (err instanceof ServiceError) {
        return apiResponse.error(res, err.message, err.statusCode);
    }

    if (err instanceof PrismaClientKnownRequestError) {
        switch (err.code) {
            case "P2002": {
                const modelName = (err.meta?.modelName as string | undefined) || "record";
                return apiResponse.error(res, `duplicated value at ${modelName?.toLowerCase()}`, StatusCodes.CONFLICT);
            }
            case "P2025": {
                const modelName = (err.meta?.modelName as string | undefined) || "record";
                return apiResponse.error(res, `${modelName?.toLowerCase()} not found`, StatusCodes.NOT_FOUND);
            }
            case "P2003": {
                const modelName = (err.meta?.modelName as string | undefined) || "record";
                return apiResponse.error(res, `invalid reference on ${modelName}`, StatusCodes.BAD_REQUEST);
            }
            default:
                return apiResponse.error(res, "unhandler prisma error", StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    if (err instanceof PrismaClientValidationError) {
        return apiResponse.error(res, "invalid data", StatusCodes.UNPROCESSABLE_ENTITY);
    }

    return apiResponse.error(res, "internal server error");
}
