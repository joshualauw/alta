import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { ChangeSourceGroupRequest } from "@/modules/group/dtos/changeSourceGroupDto";
import { CreateGroupRequest } from "@/modules/group/dtos/createGroupDto";
import { UpdateGroupRequest } from "@/modules/group/dtos/updateGroupDto";
import * as groupService from "@/modules/group/groupService";
import { apiResponse } from "@/utils/apiResponse";
import { PagingQuery } from "@/types/PagingQuery";

export async function getAllGroup(req: Request<{}, {}, {}, PagingQuery>, res: Response) {
    const result = await groupService.getAllGroup(req.query);
    return apiResponse.success(res, result, "get all group successful");
}

export async function getGroupDetail(req: Request<{ id: string }>, res: Response) {
    const result = await groupService.getGroupDetail(Number(req.params.id));
    return apiResponse.success(res, result, "get group detail successful");
}

export async function createGroup(req: Request<{}, {}, CreateGroupRequest>, res: Response) {
    const result = await groupService.createGroup(req.body);
    return apiResponse.success(res, result, "create group successful", StatusCodes.CREATED);
}

export async function updateGroup(req: Request<{ id: string }, {}, UpdateGroupRequest>, res: Response) {
    const result = await groupService.updateGroup(Number(req.params.id), req.body);
    return apiResponse.success(res, result, "update group successful");
}

export async function deleteGroup(req: Request<{ id: string }>, res: Response) {
    const result = await groupService.deleteGroup(Number(req.params.id));
    return apiResponse.success(res, result, "delete group successful");
}

export async function changeSourceGroup(req: Request<{}, {}, ChangeSourceGroupRequest>, res: Response) {
    const result = await groupService.changeSourceGroup(req.body);
    return apiResponse.success(res, result, "change source group successful");
}
