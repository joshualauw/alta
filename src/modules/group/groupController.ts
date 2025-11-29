import { Request, Response } from "express";
import { CreateGroupRequest } from "@/modules/group/dtos/createGroupDto";
import { UpdateGroupRequest } from "@/modules/group/dtos/updateGroupDto";
import * as groupService from "@/modules/group/groupService";
import { apiResponse } from "@/utils/apiResponse";

export async function getAllGroup(req: Request, res: Response) {
    const result = await groupService.getAllGroup();
    return apiResponse.success(res, result, "get all group succesful");
}

export async function createGroup(req: Request<{}, {}, CreateGroupRequest>, res: Response) {
    const result = await groupService.createGroup(req.body);
    return apiResponse.success(res, result, "create group succesful");
}

export async function updateGroup(req: Request<{ id: string }, {}, UpdateGroupRequest>, res: Response) {
    const result = await groupService.updateGroup(Number(req.params.id), req.body);
    return apiResponse.success(res, result, "update group succesful");
}

export async function deleteGroup(req: Request<{ id: string }>, res: Response) {
    const result = await groupService.deleteGroup(Number(req.params.id));
    return apiResponse.success(res, result, "delete group succesful");
}
