import { v4 as uuidv4 } from "uuid";
import { SourceCreateInput, SourceWhereInput } from "@/database/generated/prisma/models";
import { searchLogQueue, sourceQueue } from "@/lib/bullmq";
import { prisma } from "@/lib/prisma";
import {
    CreateBulkSourceQuery,
    CreateBulkSourceRequest,
    CreateBulkSourceResponse
} from "@/modules/source/dtos/createBulkSourceDto";
import { CreateSourceQuery, CreateSourceRequest, CreateSourceResponse } from "@/modules/source/dtos/createSourceDto";
import { DeleteSourceResponse } from "@/modules/source/dtos/deleteSourceDto";
import { GetAllSourceQuery, GetAllSourceResponse } from "@/modules/source/dtos/getAllSourceDto";
import { GetSourceDetailResponse } from "@/modules/source/dtos/getSourceDetailDto";
import { SearchSourceQuery, SearchSourceRequest, SearchSourceResponse } from "@/modules/source/dtos/searchSourceDto";
import { UpdateSourceRequest, UpdateSourceResponse } from "@/modules/source/dtos/updateSourceDto";
import * as ragService from "@/modules/source/services/ragService";
import { omit, pick } from "@/utils/mapper";
import { JsonObject } from "@prisma/client/runtime/client";
import { AnswerTone } from "@/modules/source/types/AnswerTone";

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
        createdAt: source.createdAt.toISOString(),
        updatedAt: source.updatedAt.toISOString()
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

export async function createSource(
    payload: CreateSourceRequest,
    query: CreateSourceQuery
): Promise<CreateSourceResponse> {
    const data = getCreateSourcePayload(payload);

    const preset = await prisma.preset.findFirstOrThrow({
        where: { code: query.preset ? query.preset : "default" }
    });

    const source = await prisma.$transaction(async (tx) => {
        const source = await tx.source.create({ data: { ...data, status: "DONE" } });
        await ragService.ingest(source, preset);

        return source;
    });

    return { ...pick(source, "id", "name"), createdAt: source.createdAt.toISOString() };
}

export async function createBulkSource(
    payload: CreateBulkSourceRequest,
    query: CreateBulkSourceQuery
): Promise<CreateBulkSourceResponse> {
    await prisma.preset.findFirstOrThrow({
        where: { code: query.preset ? query.preset : "default" }
    });

    const sources = payload.map((p) => {
        const data = getCreateSourcePayload(p);
        data.jobId = uuidv4();

        return data;
    });

    await prisma.$transaction(async (tx) => {
        await tx.source.createMany({ data: sources });

        await sourceQueue.addBulk(
            sources.map((s) => ({
                name: `job_${s.jobId}`,
                data: {
                    jobId: s.jobId!,
                    preset: query.preset
                }
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

export async function searchSource(
    payload: SearchSourceRequest,
    query: SearchSourceQuery
): Promise<SearchSourceResponse> {
    const preset = await prisma.preset.findFirstOrThrow({
        where: { code: query.preset ? query.preset : "default" }
    });

    const rerank = query.rerank ? Number(query.rerank) == 1 : false;
    const tone: AnswerTone = query.tone ? query.tone : "normal";

    const result = await ragService.search(payload, rerank, preset, tone);

    const jobId = uuidv4();

    await searchLogQueue.add(`job_${jobId}`, {
        question: payload.question,
        isRerank: rerank,
        tone: tone,
        searchOptions: omit(preset, "id", "name", "code", "createdAt", "updatedAt"),
        metadataFilters: payload.filters,
        ...pick(result, "answer", "responseTimeMs", "readUnitCost", "rerankUnitCost", "embeddingTokenCost"),
        ...pick(result, "chunksRetrieved", "chunksReranked")
    });

    return { answer: result.answer, references: result.chunksReferences };
}
