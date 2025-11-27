import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { commonConfig } from "@/config/commonConfig";
import { UserUpdateInput } from "@/database/generated/prisma/models";
import {
    BadRequestError,
    ForbiddenError,
    NotFoundError,
    UnauthorizedError,
} from "@/lib/internal/errors";
import { prisma } from "@/lib/prisma";
import { CreateUserRequest, CreateUserResponse } from "@/modules/user/dtos/create-user.dto";
import { DeleteUserResponse } from "@/modules/user/dtos/delete-user.dto";
import { LoginRequest, LoginResponse } from "@/modules/user/dtos/login.dto";
import { UpdateUserRequest, UpdateUserResponse } from "@/modules/user/dtos/update-user.dto";
import { UserJwtPayload } from "@/types/UserJwtPayload";
import { omit, pick } from "@/utils/mapper";

export async function login(payload: LoginRequest): Promise<LoginResponse> {
    const user = await prisma.user.findUnique({
        where: { email: payload.email },
    });

    if (!user) throw new NotFoundError("user not found");

    const isPasswordValid = await bcrypt.compare(payload.password, user.password);
    if (!isPasswordValid) throw new UnauthorizedError("invalid credentials");

    const token = jwt.sign(omit(user, "password"), commonConfig.jwtSecret, {
        expiresIn: commonConfig.jwtExpiresIn,
    });

    return { ...pick(user, "id", "email", "name", "role"), token };
}

export async function createUser(payload: CreateUserRequest): Promise<CreateUserResponse> {
    const user = await prisma.user.findUnique({
        where: { email: payload.email },
    });

    if (user) throw new BadRequestError("user with this email already exist");

    const hashed = await bcrypt.hash(payload.password, 10);

    const newUser = await prisma.user.create({
        data: { ...payload, role: "USER", password: hashed },
    });

    return {
        ...pick(newUser, "id", "email", "name", "role", "isActive"),
        createdAt: newUser.createdAt.toISOString(),
    };
}

export async function updateUser(payload: UpdateUserRequest): Promise<UpdateUserResponse> {
    const user = await prisma.user.findUnique({
        where: { email: payload.email },
    });

    if (!user) throw new NotFoundError("user not found");

    const updateArgs: UserUpdateInput = { ...payload };

    if (payload.password != undefined) {
        updateArgs.password = await bcrypt.hash(payload.password, 10);
    }

    const updatedUser = await prisma.user.update({
        where: { id: user.id },
        data: updateArgs,
    });

    return {
        ...pick(updatedUser, "id", "email", "name", "role", "isActive"),
        updatedAt: updatedUser.updatedAt.toISOString(),
    };
}

export async function deleteUser(
    id: number,
    currentUser: UserJwtPayload
): Promise<DeleteUserResponse> {
    const user = await prisma.user.findFirst({
        where: { id },
    });

    if (!user) throw new NotFoundError("user not found");
    if (user.id == currentUser.id) throw new ForbiddenError("cannot self delete");

    const deletedUser = await prisma.user.delete({
        where: { id: user.id },
    });

    return { id: deletedUser.id };
}
