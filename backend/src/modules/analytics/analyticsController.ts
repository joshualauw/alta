import * as analyticsService from "@/modules/analytics/analyticsService";
import { apiResponse } from "@/utils/apiResponse";
import { Request, Response } from "express";
import { GetAllSearchLogQuery } from "@/modules/analytics/dtos/getAllSearchLogDto";

export async function getAllSearchLog(req: Request<{}, {}, {}, GetAllSearchLogQuery>, res: Response) {
    const result = await analyticsService.getAllSearchLog(req.query);
    return apiResponse.success(res, result, "get all search log successful");
}
