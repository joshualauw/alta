import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { apiResponse } from "@/utils/apiResponse";
import config from "@/config";
import crypto from "crypto";

export default function authorize(req: Request, res: Response, next: NextFunction) {
    const apiKey = req.headers["x-api-key"];

    if (apiKey) {
        const userBuffer = Buffer.from(apiKey.toString());
        const keyBuffer = Buffer.from(config.ALTA_API_KEY);

        // Timing-safe comparison to prevent timing attacks
        if (userBuffer.length !== keyBuffer.length) {
            crypto.timingSafeEqual(Buffer.alloc(keyBuffer.length), keyBuffer);
            return apiResponse.error(res, "invalid API Key", StatusCodes.UNAUTHORIZED);
        }

        if (!crypto.timingSafeEqual(userBuffer, keyBuffer)) {
            return apiResponse.error(res, "invalid API Key", StatusCodes.UNAUTHORIZED);
        }

        return next();
    }

    return apiResponse.error(res, "Unauthorized", StatusCodes.UNAUTHORIZED);
}
