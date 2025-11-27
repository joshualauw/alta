import { Response } from "express";
import { ApiResponse } from "@/types/ApiResponse";

export const apiResponse = {
    success: <T>(res: Response, data: T, message: string, code: number = 200) =>
        res.status(code).send({
            success: true,
            data,
            message,
            errors: [],
        } as ApiResponse<T>),

    error: (res: Response, message: string, code = 500, errors: string[] = []) =>
        res.status(code).send({
            success: false,
            data: null,
            message,
            errors,
        } as ApiResponse<null>),
};
