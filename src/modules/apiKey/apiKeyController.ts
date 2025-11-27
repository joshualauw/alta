import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import * as apiKeyService from "@/modules/apiKey/apiKeyService";
import { CreateApiKeyRequest, CreateApiKeyResponse } from "@/modules/apiKey/dtos/createApiKeyDto";
import { DeleteApiKeyResponse } from "@/modules/apiKey/dtos/deleteApiKeyDto";
import { GetAllApiKeyResponse } from "@/modules/apiKey/dtos/getAllApiKeyDto";
import { UpdateApiKeyRequest, UpdateApiKeyResponse } from "@/modules/apiKey/dtos/updateApiKeyDto";
import { ApiResponse } from "@/types/ApiResponse";
import { apiResponse } from "@/utils/apiResponse";

export async function getAllApiKey(req: Request, res: Response<ApiResponse<GetAllApiKeyResponse[]>>) {
    const result = await apiKeyService.getAllApikey();
    return apiResponse.success(res, result, "get all api key successful");
}

export async function createApiKey(
    req: Request<{}, {}, CreateApiKeyRequest>,
    res: Response<ApiResponse<CreateApiKeyResponse>>
) {
    const result = await apiKeyService.createApiKey(req.body);
    return apiResponse.success(res, result, "create api key successful", StatusCodes.CREATED);
}

export async function updateApiKey(
    req: Request<{ id: string }, {}, UpdateApiKeyRequest>,
    res: Response<ApiResponse<UpdateApiKeyResponse>>
) {
    const result = await apiKeyService.updateApiKey(Number(req.params.id), req.body);
    return apiResponse.success(res, result, "update api key successful");
}

export async function deleteApiKey(
    req: Request<{ id: string }, {}, {}>,
    res: Response<ApiResponse<DeleteApiKeyResponse>>
) {
    const result = await apiKeyService.deleteApiKey(Number(req.params.id));
    return apiResponse.success(res, result, "delete api key successful");
}
