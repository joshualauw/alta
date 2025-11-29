import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import config from "@/config";
import { apiResponse } from "@/utils/apiResponse";

export function authorize(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return apiResponse.error(res, "unauthorized access", StatusCodes.UNAUTHORIZED);
    }

    const apiKey = authHeader.split(" ")[1];

    if (apiKey != config.alta.apiKey) {
        return apiResponse.error(res, "unauthorized access", StatusCodes.UNAUTHORIZED);
    }

    next();
}
