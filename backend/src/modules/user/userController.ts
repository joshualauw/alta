import { Request, Response } from "express";
import * as userService from "@/modules/user/userService";
import { LoginRequest } from "@/modules/user/dtos/loginDto";
import { apiResponse } from "@/utils/apiResponse";

export async function login(req: Request<{}, {}, LoginRequest>, res: Response) {
    const result = await userService.login(req.body);
    return apiResponse.success(res, result, "login successful");
}
