import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { CreateUserRequest } from "@/modules/user/dtos/createUserDto";
import { LoginRequest } from "@/modules/user/dtos/loginDto";
import { UpdateUserRequest } from "@/modules/user/dtos/updateUserDto";
import * as userService from "@/modules/user/userService";
import { apiResponse } from "@/utils/apiResponse";

export async function login(req: Request<{}, {}, LoginRequest>, res: Response) {
    const result = await userService.login(req.body);
    return apiResponse.success(res, result, "login successful");
}

export async function getAllUser(req: Request, res: Response) {
    const result = await userService.getAllUser();
    return apiResponse.success(res, result, "get all user succeessful");
}

export async function createUser(req: Request<{}, {}, CreateUserRequest>, res: Response) {
    const result = await userService.createUser(req.body);
    return apiResponse.success(res, result, "create user successful", StatusCodes.CREATED);
}

export async function updateUser(req: Request<{}, {}, UpdateUserRequest>, res: Response) {
    const result = await userService.updateUser(req.body);
    return apiResponse.success(res, result, "update user successful");
}

export async function deleteUser(req: Request<{ id: string }>, res: Response) {
    const result = await userService.deleteUser(Number(req.params.id), req.user!);
    return apiResponse.success(res, result, "delete user successful");
}
