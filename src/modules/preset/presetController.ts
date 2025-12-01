import { Request, Response } from "express";
import { CreatePresetRequest } from "@/modules/preset/dtos/createPresetDto";
import { UpdatePresetRequest } from "@/modules/preset/dtos/updatePresetDto";
import * as presetService from "@/modules/preset/presetService";
import { apiResponse } from "@/utils/apiResponse";

export async function getAllPreset(req: Request, res: Response) {
    const result = await presetService.getAllPreset();
    return apiResponse.success(res, result, "get all preset succesful");
}

export async function getPresetDetail(req: Request<{ id: string }>, res: Response) {
    const result = await presetService.getPresetDetail(Number(req.params.id));
    return apiResponse.success(res, result, "get preset detail succesful");
}

export async function createPreset(req: Request<{}, {}, CreatePresetRequest>, res: Response) {
    const result = await presetService.createPreset(req.body);
    return apiResponse.success(res, result, "create preset succesful");
}

export async function updatePreset(req: Request<{ id: string }, {}, UpdatePresetRequest>, res: Response) {
    const result = await presetService.updatePreset(Number(req.params.id), req.body);
    return apiResponse.success(res, result, "update preset succesful");
}

export async function deletePreset(req: Request<{ id: string }>, res: Response) {
    const result = await presetService.deletePreset(Number(req.params.id));
    return apiResponse.success(res, result, "delete preset succesful");
}
