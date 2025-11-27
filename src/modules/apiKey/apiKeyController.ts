import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import * as apiKeyService from "@/modules/apiKey/apiKeyService";
import { CreateApiKeyRequest, CreateApiKeyResponse } from "@/modules/apiKey/dtos/createApiKeyDto";
import { ApiResponse } from "@/types/ApiResponse";
import { apiResponse } from "@/utils/apiResponse";

export async function createApiKey(
    req: Request<{}, {}, CreateApiKeyRequest>,
    res: Response<ApiResponse<CreateApiKeyResponse>>
) {
    const result = await apiKeyService.createApiKey(req.body);
    return apiResponse.success(res, result, "create api key successful", StatusCodes.CREATED);
}
