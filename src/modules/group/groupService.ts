import { prisma } from "@/lib/prisma";
import { CreateGroupRequest, CreateGroupResponse } from "@/modules/group/dtos/createGroupDto";
import { DeleteGroupResponse } from "@/modules/group/dtos/deleteGroupDto";
import { GetAllGroupResponse } from "@/modules/group/dtos/getAllGroupDto";
import { UpdateGroupRequest, UpdateGroupResponse } from "@/modules/group/dtos/updateGroupDto";
import { pick } from "@/utils/mapper";

export async function getAllGroup(): Promise<GetAllGroupResponse[]> {
    const groups = await prisma.group.findMany();

    return groups.map((g) => ({
        ...pick(g, "id", "name", "colorCode", "createdAt")
    }));
}

export async function createGroup(payload: CreateGroupRequest): Promise<CreateGroupResponse> {
    const group = await prisma.group.create({
        data: payload
    });

    return { ...pick(group, "id", "name", "colorCode"), createdAt: group.createdAt.toISOString() };
}

export async function updateGroup(id: number, payload: UpdateGroupRequest): Promise<UpdateGroupResponse> {
    const group = await prisma.group.update({
        where: { id },
        data: payload
    });

    return { ...pick(group, "id", "name", "colorCode"), updatedAt: group.createdAt.toISOString() };
}

export async function deleteGroup(id: number): Promise<DeleteGroupResponse> {
    await prisma.group.delete({
        where: { id }
    });

    return { id };
}
