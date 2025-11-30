import { v4 as uuidv4 } from "uuid";
import { SourceCreateInput, SourceWhereInput } from "@/database/generated/prisma/models";
import { sourceQueue } from "@/lib/bullmq";
import { prisma } from "@/lib/prisma";
import { CreateBulkSourceRequest, CreateBulkSourceResponse } from "@/modules/source/dtos/createBulkSourceDto";
import { CreateSourceRequest, CreateSourceResponse } from "@/modules/source/dtos/createSourceDto";
import { DeleteSourceResponse } from "@/modules/source/dtos/deleteSourceDto";
import { GetAllSourceQuery, GetAllSourceResponse } from "@/modules/source/dtos/getAllSourceDto";
import { GetSourceDetailResponse } from "@/modules/source/dtos/getSourceDetailDto";
import { SearchSourceRequest, SearchSourceResponse } from "@/modules/source/dtos/searchSourceDto";
import { UpdateSourceRequest, UpdateSourceResponse } from "@/modules/source/dtos/updateSourceDto";
import * as ragService from "@/modules/source/services/ragService";
import { pick } from "@/utils/mapper";
import { JsonObject } from "@prisma/client/runtime/client";

export async function getAllSource(query: GetAllSourceQuery): Promise<GetAllSourceResponse[]> {
    const filters: SourceWhereInput = {};
    if (query.groupId) {
        filters.groupId = Number(query.groupId);
    }

    const sources = await prisma.source.findMany({
        where: filters,
        include: { group: true }
    });

    return sources.map((s) => ({
        ...pick(s, "id", "name", "fileUrl", "status"),
        groupId: s.groupId,
        groupName: s.group?.name ?? null,
        createdAt: s.createdAt.toISOString()
    }));
}

export async function getSourceDetail(id: number): Promise<GetSourceDetailResponse> {
    const source = await prisma.source.findFirstOrThrow({
        where: { id },
        include: { group: true }
    });

    return {
        ...pick(source, "id", "name", "content", "fileUrl", "status", "statusReason"),
        groupId: source.groupId,
        groupName: source.group?.name ?? null,
        createdAt: source.createdAt.toISOString()
    };
}

function getCreateSourcePayload(payload: CreateSourceRequest) {
    const { metadata, ...rest } = payload;
    const data: SourceCreateInput = { ...rest };

    if (metadata) {
        data.metadata = metadata as JsonObject;
    }

    return data;
}

export async function createSource(payload: CreateSourceRequest): Promise<CreateSourceResponse> {
    const data = getCreateSourcePayload(payload);

    const source = await prisma.$transaction(async (tx) => {
        const source = await tx.source.create({ data: { ...data, status: "DONE" } });
        await ragService.ingest(source);

        return source;
    });

    return { ...pick(source, "id", "name"), createdAt: source.createdAt.toISOString() };
}

export async function createBulkSource(payload: CreateBulkSourceRequest): Promise<CreateBulkSourceResponse> {
    const sources = payload.sources.map((p) => {
        const data = getCreateSourcePayload(p);
        data.jobId = uuidv4();

        return data;
    });

    await prisma.$transaction(async (tx) => {
        await tx.source.createMany({ data: sources });

        await sourceQueue.addBulk(
            sources.map((s) => ({
                name: `job_${s.jobId}`,
                data: s.jobId
            }))
        );
    });

    return { createdAt: new Date().toISOString() };
}

export async function updateSource(id: number, payload: UpdateSourceRequest): Promise<UpdateSourceResponse> {
    const updatedSource = await prisma.source.update({
        where: { id },
        data: payload
    });

    return { ...pick(updatedSource, "id", "name"), updatedAt: updatedSource.updatedAt.toISOString() };
}

export async function deleteSource(id: number): Promise<DeleteSourceResponse> {
    await prisma.$transaction(async (tx) => {
        await tx.source.delete({
            where: { id }
        });
        await ragService.remove(id);
    });

    return { id };
}

export async function searchSource(payload: SearchSourceRequest): Promise<SearchSourceResponse> {
    return await ragService.search(payload);
}
