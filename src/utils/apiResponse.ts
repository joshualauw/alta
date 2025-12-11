import { Response } from "express";
import { ApiResponse } from "@/types/ApiResponse";
import { PagingResponse } from "@/types/PagingResponse";

export const apiResponse = {
    success: <T>(res: Response, data: T, message: string, code: number = 200) =>
        res.status(code).send({
            success: true,
            data,
            message,
            errors: []
        } as ApiResponse<T>),

    error: (res: Response, message: string, code = 500, errors: string[] = []) =>
        res.status(code).send({
            success: false,
            data: null,
            message,
            errors
        } as ApiResponse<null>)
};

export function pagingResponse<T>(items: T[], totalItems: number, page: number, size: number): PagingResponse<T> {
    const totalPages = Math.ceil(totalItems / size);

    return {
        items: items,
        totalItems,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
    };
}
