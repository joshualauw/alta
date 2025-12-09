import { successResponseSchema } from "@/lib/openapi/schemas/apiResponseSchema";
import { apiKeyHeaderSchema } from "@/lib/openapi/schemas/headerSchema";
import { getAllSearchLogQuery, getAllSearchLogResponse } from "@/modules/analytics/dtos/getAllSearchLogDto";
import z from "zod";
import { ZodOpenApiPathItemObject } from "zod-openapi";

export const getAllSearchLogPath: ZodOpenApiPathItemObject = {
    id: "get-all-search-log",
    summary: "get all search log",
    get: {
        requestParams: {
            query: getAllSearchLogQuery
        },
        responses: {
            200: {
                description: "success",
                content: {
                    "application/json": {
                        schema: successResponseSchema(z.array(getAllSearchLogResponse))
                    }
                },
                headers: apiKeyHeaderSchema
            }
        },
        tags: ["analytics"]
    }
};
