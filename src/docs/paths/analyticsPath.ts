import { successResponseSchema } from "@/docs/schemas/apiResponseSchema";
import { getDashboardStatisticsResponse } from "@/modules/analytics/dtos/getDashboardStatisticsDto";
import { ZodOpenApiPathItemObject } from "zod-openapi";

export const getDashboardStatisticsPath: ZodOpenApiPathItemObject = {
    id: "get-dashboard-statistics",
    summary: "get required statistics for dashboard",
    get: {
        responses: {
            200: {
                description: "success",
                content: {
                    "application/json": {
                        schema: successResponseSchema(getDashboardStatisticsResponse)
                    }
                }
            }
        },
        tags: ["analytics"]
    }
};
