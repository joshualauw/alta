import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { apiResponse } from "@/utils/apiResponse";
import config from "@/config";
import crypto from "crypto";

export default function authorize(req: Request, res: Response, next: NextFunction) {
    const apiKey = req.headers["x-api-key"];

    if (!apiKey) {
        return apiResponse.error(res, "invalid API Key", StatusCodes.UNAUTHORIZED);
    }

    const userBuffer = Buffer.from(apiKey.toString());
    const keyBuffer = Buffer.from(config.ALTA_API_KEY);

    if (userBuffer.length !== keyBuffer.length) {
        crypto.timingSafeEqual(Buffer.alloc(keyBuffer.length), keyBuffer);
        return apiResponse.error(res, "invalid API Key", StatusCodes.UNAUTHORIZED);
    }

    if (!crypto.timingSafeEqual(userBuffer, keyBuffer)) {
        return apiResponse.error(res, "invalid API Key", StatusCodes.UNAUTHORIZED);
    }

    next();
}
