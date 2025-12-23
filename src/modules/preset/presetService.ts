import slugify from "slugify";
import { PresetUpdateInput } from "@/database/generated/prisma/models";
import { prisma } from "@/lib/prisma";
import { CreatePresetRequest, CreatePresetResponse } from "@/modules/preset/dtos/createPresetDto";
import { DeletePresetResponse } from "@/modules/preset/dtos/deletePresetDto";
import { GetAllPresetResponse } from "@/modules/preset/dtos/getAllPresetDto";
import { GetPresetDetailResponse } from "@/modules/preset/dtos/getPresetDetailDto";
import { UpdatePresetRequest, UpdatePresetResponse } from "@/modules/preset/dtos/updatePresetDto";
import { omit, pick } from "@/utils/mapper";
import { PagingQuery } from "@/types/PagingQuery";
import { pagingResponse } from "@/utils/apiResponse";

export async function getAllPreset(query: PagingQuery): Promise<GetAllPresetResponse> {
    const [presets, count] = await prisma.$transaction([
        prisma.preset.findMany({
            skip: (query.page - 1) * query.size,
            take: query.size,
            select: { id: true, name: true, code: true, createdAt: true }
        }),
        prisma.preset.count()
    ]);

    const items = presets.map((p) => ({
        ...pick(p, "id", "name", "code"),
        createdAt: p.createdAt.toISOString()
    }));

    return pagingResponse(items, count, query.page, query.size);
}

export async function getPresetDetail(id: number): Promise<GetPresetDetailResponse> {
    const preset = await prisma.preset.findFirstOrThrow({
        where: { id }
    });

    return { ...preset, createdAt: preset.createdAt.toISOString(), updatedAt: preset.updatedAt.toISOString() };
}

export async function createPreset(payload: CreatePresetRequest): Promise<CreatePresetResponse> {
    const code = slugify(payload.name, { replacement: "_", lower: true });

    const preset = await prisma.preset.create({
        data: { ...payload, code }
    });

    return { ...omit(preset, "updatedAt", "createdAt"), createdAt: preset.createdAt.toISOString() };
}

export async function updatePreset(id: number, payload: UpdatePresetRequest): Promise<UpdatePresetResponse> {
    const data: PresetUpdateInput = payload;

    if (payload.name) {
        data.code = slugify(payload.name, { replacement: "_", lower: true });
    }

    const preset = await prisma.preset.update({
        where: { id },
        data
    });

    return { ...omit(preset, "updatedAt", "createdAt"), updatedAt: preset.updatedAt.toISOString() };
}

export async function deletePreset(id: number): Promise<DeletePresetResponse> {
    await prisma.preset.delete({
        where: { id }
    });

    return { id };
}
