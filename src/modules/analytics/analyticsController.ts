import { Request, Response } from "express";
import * as analyticsController from "@/modules/analytics/analyticsService";
import { apiResponse } from "@/utils/apiResponse";

export async function getDashboardStatistics(req: Request, res: Response) {
    const result = await analyticsController.getDashboardStatistics();
    return apiResponse.success(res, result, "get dashboard statistics successful");
}
