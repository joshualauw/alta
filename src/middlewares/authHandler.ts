import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import { commonConfig } from "@/config/commonConfig";
import { UserJwtPayload } from "@/types/UserJwtPayload";
import { apiResponse } from "@/utils/apiResponse";

export function authorize(adminOnly: boolean = false) {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            const authHeader = req.headers.authorization;

            if (!authHeader || !authHeader.startsWith("Bearer ")) {
                return apiResponse.error(res, "unauthorized access", StatusCodes.UNAUTHORIZED);
            }

            const token = authHeader.split(" ")[1];

            const decoded = jwt.verify(token, commonConfig.jwtSecret);
            req.user = decoded as UserJwtPayload;

            if (adminOnly && req.user.role != "ADMIN") {
                return apiResponse.error(res, "forbidden access", StatusCodes.FORBIDDEN);
            }

            next();
        } catch (err) {
            return apiResponse.error(res, "invalid or expired token", StatusCodes.UNAUTHORIZED);
        }
    };
}
