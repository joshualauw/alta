import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { apiResponse } from "@/utils/apiResponse";
import config from "@/config";
import crypto from "crypto";
import jwt, { JsonWebTokenError } from "jsonwebtoken";
import { UserJwtPayload } from "@/types/UserJwtPayload";

export default function authorize(req: Request, res: Response, next: NextFunction) {
    const apiKey = req.headers["x-api-key"];

    if (apiKey) {
        const userBuffer = Buffer.from(apiKey.toString());
        const keyBuffer = Buffer.from(config.ALTA_API_KEY);

        if (userBuffer.length !== keyBuffer.length) {
            crypto.timingSafeEqual(Buffer.alloc(keyBuffer.length), keyBuffer);
            return apiResponse.error(res, "invalid API Key", StatusCodes.UNAUTHORIZED);
        }

        if (!crypto.timingSafeEqual(userBuffer, keyBuffer)) {
            return apiResponse.error(res, "invalid API Key", StatusCodes.UNAUTHORIZED);
        }

        return next();
    }

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return apiResponse.error(res, "Missing or invalid token format", StatusCodes.UNAUTHORIZED);
    }

    try {
        const token = authHeader.split(" ")[1];
        const user = jwt.verify(token, config.JWT_SECRET) as UserJwtPayload;

        req.user = user;

        return next();
    } catch (err) {
        if (err instanceof JsonWebTokenError) {
            return apiResponse.error(res, "Unauthorized", StatusCodes.UNAUTHORIZED);
        }
    }

    return apiResponse.error(res, "Unauthorized", StatusCodes.UNAUTHORIZED);
}
