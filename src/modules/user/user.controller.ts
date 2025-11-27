import { Request, Response } from "express";
import { LoginRequest } from "@/modules/user/dtos/login.dto";
import * as userService from "@/modules/user/user.service";
import { apiResponse } from "@/utils/apiResponse";

export async function login(req: Request, res: Response) {
    const body = req.body as LoginRequest;
    const result = await userService.login(body);

    return apiResponse.success(res, result, "login successful");
}
