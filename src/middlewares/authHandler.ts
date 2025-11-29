import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import config from "@/config";
import { apiResponse } from "@/utils/apiResponse";

export function authorize(req: Request, res: Response, next: NextFunction) {
    const apiKey = req.headers["x-api-key"];

    if (!apiKey) {
        return apiResponse.error(res, "unauthorized access", StatusCodes.UNAUTHORIZED);
    }

    if (apiKey != config.alta.apiKey) {
        return apiResponse.error(res, "unauthorized access", StatusCodes.UNAUTHORIZED);
    }

    next();
}
