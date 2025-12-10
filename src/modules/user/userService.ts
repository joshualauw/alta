import config from "@/config";
import { UnauthorizedError } from "@/lib/internal/errors";
import { prisma } from "@/lib/prisma";
import { LoginRequest, LoginResponse } from "@/modules/user/dtos/loginDto";
import { pick } from "@/utils/mapper";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function login(payload: LoginRequest): Promise<LoginResponse> {
    const user = await prisma.user.findFirst({
        where: { email: payload.email }
    });

    if (!user) throw new UnauthorizedError("invalid credentials");

    const isValidPassword = await bcrypt.compare(payload.password, user.password);
    if (!isValidPassword) throw new UnauthorizedError("invalid credentials");

    const userPayload = pick(user, "id", "name", "email", "role");

    const token = jwt.sign(userPayload, config.JWT_SECRET, { expiresIn: config.JWT_EXPIRES_IN });

    return { ...userPayload, token };
}
