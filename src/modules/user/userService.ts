import config from "@/config";
import { UnauthorizedError } from "@/lib/internal/errors";
import { prisma } from "@/lib/prisma";
import { LoginRequest, LoginResponse } from "@/modules/user/dtos/loginDto";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function login(payload: LoginRequest): Promise<LoginResponse> {
    const user = await prisma.user.findUnique({
        where: {
            email: payload.email
        }
    });

    if (!user) {
        throw new UnauthorizedError("invalid credentials");
    }

    const isPasswordValid = await bcrypt.compare(payload.password, user.password);
    if (!isPasswordValid) {
        throw new UnauthorizedError("invalid credentials");
    }

    const token = jwt.sign({ userId: user.id }, config.JWT_SECRET, {
        expiresIn: config.JWT_EXPIRES_IN
    });

    return {
        userId: user.id,
        token
    };
}
