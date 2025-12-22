import { LoginRequest } from "@/modules/user/dtos/loginDto";
import { apiResponse } from "@/utils/apiResponse";
import { Request, Response } from "express";
import * as userService from "@/modules/user/userService";

export async function me(req: Request, res: Response) {
    const result = await userService.me(req.user);
    return apiResponse.success(res, result, "get me successful");
}

export async function login(req: Request<{}, {}, LoginRequest>, res: Response) {
    const result = await userService.login(req.body);
    return apiResponse.success(res, result, "login successful");
}
