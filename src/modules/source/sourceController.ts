import { Request, Response } from "express";
import { CreateBulkSourceQuery, CreateBulkSourceRequest } from "@/modules/source/dtos/createBulkSourceDto";
import { CreateSourceQuery, CreateSourceRequest } from "@/modules/source/dtos/createSourceDto";
import { GetAllSourceQuery } from "@/modules/source/dtos/getAllSourceDto";
import { SearchSourceQuery, SearchSourceRequest } from "@/modules/source/dtos/searchSourceDto";
import { UpdateSourceRequest } from "@/modules/source/dtos/updateSourceDto";
import * as sourceService from "@/modules/source/sourceService";
import { apiResponse } from "@/utils/apiResponse";
import { StatusCodes } from "http-status-codes";
import { FilterSourceRequest } from "@/modules/source/dtos/filterSourceDto";
import { UploadSourceQuery, UploadSourceRequest } from "@/modules/source/dtos/uploadSourceDto";

export async function getAllSource(req: Request<{}, {}, {}, GetAllSourceQuery>, res: Response) {
    const result = await sourceService.getAllSource(req.query);
    return apiResponse.success(res, result, "get all source successful");
}

export async function getSourceDetail(req: Request<{ id: string }>, res: Response) {
    const result = await sourceService.getSourceDetail(Number(req.params.id));
    return apiResponse.success(res, result, "get source detail successful");
}

export async function getSourcePresignedUrl(req: Request, res: Response) {
    const result = await sourceService.getSourcePresignedUrl();
    return apiResponse.success(res, result, "get source presigned url successful");
}

export async function uploadSource(req: Request<{}, {}, UploadSourceRequest, UploadSourceQuery>, res: Response) {
    const result = await sourceService.uploadSource(req.query, req.body);
    return apiResponse.success(res, result, "upload source successful");
}

export async function filterSource(req: Request<{}, {}, FilterSourceRequest>, res: Response) {
    const result = await sourceService.filterSource(req.body);
    return apiResponse.success(res, result, "filter source successful");
}

export async function createSource(req: Request<{}, {}, CreateSourceRequest, CreateSourceQuery>, res: Response) {
    const result = await sourceService.createSource(req.body, req.query);
    return apiResponse.success(res, result, "create source successful", StatusCodes.CREATED);
}

export async function createBulkSource(
    req: Request<{}, {}, CreateBulkSourceRequest, CreateBulkSourceQuery>,
    res: Response
) {
    const result = await sourceService.createBulkSource(req.body, req.query);
    return apiResponse.success(res, result, "create bulk source successful", StatusCodes.CREATED);
}

export async function updateSource(req: Request<{ id: string }, {}, UpdateSourceRequest>, res: Response) {
    const result = await sourceService.updateSource(Number(req.params.id), req.body);
    return apiResponse.success(res, result, "update source successful");
}

export async function deleteSource(req: Request<{ id: string }>, res: Response) {
    const result = await sourceService.deleteSource(Number(req.params.id));
    return apiResponse.success(res, result, "delete source successful");
}

export async function searchSource(req: Request<{}, {}, SearchSourceRequest, SearchSourceQuery>, res: Response) {
    const result = await sourceService.searchSource(req.body, req.query);
    return apiResponse.success(res, result, "search source successful");
}
