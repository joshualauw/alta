import { Request, Response } from "express";
import { CreateBulkSourceRequest, CreateSourceRequest } from "@/modules/source/dtos/createSourceDto";
import { GetAllSourceQuery } from "@/modules/source/dtos/getAllSourceDto";
import { SearchSourceRequest } from "@/modules/source/dtos/searchSourceDto";
import { UpdateSourceRequest } from "@/modules/source/dtos/updateSourceDto";
import * as sourceService from "@/modules/source/sourceService";
import { apiResponse } from "@/utils/apiResponse";

export async function getAllSource(req: Request<{}, {}, {}, GetAllSourceQuery>, res: Response) {
    const result = await sourceService.getAllSource(req.query);
    return apiResponse.success(res, result, "get all source succesful");
}

export async function getSourceDetail(req: Request<{ id: string }>, res: Response) {
    const result = await sourceService.getSourceDetail(Number(req.params.id));
    return apiResponse.success(res, result, "get source detail succesful");
}

export async function createSource(req: Request<{}, {}, CreateSourceRequest>, res: Response) {
    const result = await sourceService.createSource(req.body);
    return apiResponse.success(res, result, "create source successful");
}

export async function createBulkSource(req: Request<{}, {}, CreateBulkSourceRequest>, res: Response) {
    const result = await sourceService.createBulkSource(req.body);
    return apiResponse.success(res, result, "create bulk source successful");
}

export async function updateSource(req: Request<{ id: string }, {}, UpdateSourceRequest>, res: Response) {
    const result = await sourceService.updateSource(Number(req.params.id), req.body);
    return apiResponse.success(res, result, "update source successful");
}

export async function deleteSource(req: Request<{ id: string }>, res: Response) {
    const result = await sourceService.deleteSource(Number(req.params.id));
    return apiResponse.success(res, result, "delete source successful");
}

export async function searchSource(req: Request<{}, {}, SearchSourceRequest>, res: Response) {
    const result = await sourceService.searchSource(req.body);
    return apiResponse.success(res, result, "search source successful");
}
