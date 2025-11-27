import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { CreateUserRequest, CreateUserResponse } from "@/modules/user/dtos/create-user.dto";
import { DeleteUserResponse } from "@/modules/user/dtos/delete-user.dto";
import { LoginRequest, LoginResponse } from "@/modules/user/dtos/login.dto";
import { UpdateUserRequest, UpdateUserResponse } from "@/modules/user/dtos/update-user.dto";
import * as userService from "@/modules/user/user.service";
import { ApiResponse } from "@/types/ApiResponse";
import { apiResponse } from "@/utils/apiResponse";

export async function login(
    req: Request<{}, {}, LoginRequest>,
    res: Response<ApiResponse<LoginResponse>>
) {
    const result = await userService.login(req.body);
    return apiResponse.success(res, result, "login successful");
}

export async function createUser(
    req: Request<{}, {}, CreateUserRequest>,
    res: Response<ApiResponse<CreateUserResponse>>
) {
    const result = await userService.createUser(req.body);
    return apiResponse.success(res, result, "create user successful", StatusCodes.CREATED);
}

export async function updateUser(
    req: Request<{}, {}, UpdateUserRequest>,
    res: Response<ApiResponse<UpdateUserResponse>>
) {
    const result = await userService.updateUser(req.body);
    return apiResponse.success(res, result, "update user successful");
}

export async function deleteUser(
    req: Request<{ id: string }, {}, {}>,
    res: Response<ApiResponse<DeleteUserResponse>>
) {
    const result = await userService.deleteUser(Number(req.params.id), req.user!);
    return apiResponse.success(res, result, "delete user successful");
}
