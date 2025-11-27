import bcrypt from "bcrypt";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import { commonConfig } from "@/config/commonConfig";
import { prisma } from "@/lib/prisma";
import { ServiceError } from "@/middlewares/errorHandler";
import { LoginRequest, LoginResponse } from "@/modules/user/dtos/login.dto";

export async function login(payload: LoginRequest): Promise<LoginResponse> {
    const user = await prisma.user.findUnique({
        where: { email: payload.email },
    });

    if (!user) {
        throw new ServiceError("user not found", StatusCodes.NOT_FOUND);
    }

    const isPasswordValid = await bcrypt.compare(payload.password, user.password);
    if (!isPasswordValid) {
        throw new ServiceError("invalid credentials", StatusCodes.UNAUTHORIZED);
    }

    const loggedUser = {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
    };

    const token = jwt.sign(loggedUser, commonConfig.jwtSecret, {
        expiresIn: commonConfig.jwtExpiresIn,
    });

    return { ...loggedUser, token };
}
