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
import { omit, pick } from "@/utils/mapper";
import { JsonObject } from "@prisma/client/runtime/client";
import { AnswerTone } from "@/modules/source/types/AnswerTone";
import { pagingResponse } from "@/utils/apiResponse";
import { buildMetadataFilter } from "@/modules/source/services/buildMetadataFilter";
import { FilterSourceRequest, FilterSourceResponse } from "@/modules/source/dtos/filterSourceDto";
import { GetSourcePresignedUrlResponse } from "@/modules/source/dtos/getSourcePresignedUrlDto";
import { S3 } from "@/lib/r2";
import { GetObjectCommand, PutObjectCommand, _Error } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { UploadSourceQuery, UploadSourceRequest, UploadSourceResponse } from "@/modules/source/dtos/uploadSourceDto";
import config from "@/config";
import * as ragIngestionService from "@/modules/source/services/ragIngestionService";
import * as ragSearchService from "@/modules/source/services/ragSearchService";
import { InternalServerError } from "@/lib/internal/errors";

export async function getAllSource(query: GetAllSourceQuery): Promise<GetAllSourceResponse> {
    const filters: SourceWhereInput = {};
    if (query.groupId) {
        filters.groupId = Number(query.groupId);
    }

    const [sources, count] = await prisma.$transaction([
        prisma.source.findMany({
            skip: (query.page - 1) * query.size,
            take: query.size,
            where: filters,
            include: { group: true }
        }),
        prisma.source.count()
    ]);

    const items = sources.map((s) => ({
        ...pick(s, "id", "name", "fileUrl", "status"),
        groupId: s.groupId,
        groupName: s.group?.name ?? null,
        createdAt: s.createdAt.toISOString()
    }));

    return pagingResponse(items, count, query.page, query.size);
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

export async function getSourcePresignedUrl(): Promise<GetSourcePresignedUrlResponse> {
    const objectKey = `source_${uuidv4()}`;

    const command = new PutObjectCommand({
        Bucket: config.R2_BUCKET_NAME,
        Key: objectKey,
        ContentType: "text/plain"
    });
    const putUrl = await getSignedUrl(S3, command, { expiresIn: 1500 });

    return { url: putUrl, objectKey };
}

export async function uploadSource(
    query: UploadSourceQuery,
    payload: UploadSourceRequest
): Promise<UploadSourceResponse> {
    const command = new GetObjectCommand({
        Bucket: config.R2_BUCKET_NAME,
        Key: payload.objectKey
    });

    const response = await S3.send(command);
    if (!response.Body) throw new InternalServerError("response body not found");

    const preset = await prisma.preset.findFirstOrThrow({
        where: { code: query.preset ? query.preset : "default" }
    });

    const content = await response.Body.transformToString();
    const { metadata, ...rest } = payload;
    const data: SourceCreateInput = { ...omit(rest, "objectKey"), content };
    if (metadata) {
        data.metadata = metadata as JsonObject;
    }

    const source = await prisma.$transaction(async (tx) => {
        const source = await tx.source.create({ data: { ...data, status: "DONE" } });
        await ragIngestionService.ingest(source, preset);

        return source;
    });

    return { ...pick(source, "id", "name"), createdAt: source.createdAt.toISOString() };
}

export async function filterSource(query: FilterSourceRequest): Promise<FilterSourceResponse> {
    const { sql, params } = buildMetadataFilter(query);
    const filteredSources = await prisma.$queryRawUnsafe<{ id: number }[]>(
        `SELECT id FROM "Source" WHERE ${sql}`,
        ...params
    );

    const sources = await prisma.source.findMany({
        where: { id: { in: filteredSources.map((s) => s.id) } },
        include: { group: true }
    });

    return sources.map((s) => ({
        ...pick(s, "id", "name", "fileUrl", "status"),
        groupId: s.groupId,
        groupName: s.group?.name ?? null,
        createdAt: s.createdAt.toISOString()
    }));
}

export async function createSource(
    payload: CreateSourceRequest,
    query: CreateSourceQuery
): Promise<CreateSourceResponse> {
    const preset = await prisma.preset.findFirstOrThrow({
        where: { code: query.preset ? query.preset : "default" }
    });

    const { metadata, ...rest } = payload;
    const data: SourceCreateInput = { ...rest };
    if (metadata) {
        data.metadata = metadata as JsonObject;
    }

    const source = await prisma.$transaction(async (tx) => {
        const source = await tx.source.create({ data: { ...data, status: "DONE" } });
        await ragIngestionService.ingest(source, preset);

        return source;
    });

    return { ...pick(source, "id", "name"), createdAt: source.createdAt.toISOString() };
}

export async function createBulkSource(
    payload: CreateBulkSourceRequest,
    query: CreateBulkSourceQuery
): Promise<CreateBulkSourceResponse> {
    const preset = await prisma.preset.findFirstOrThrow({
        where: { code: query.preset ? query.preset : "default" }
    });

    const sources = payload.map((p) => {
        const { metadata, ...rest } = p;
        const data: SourceCreateInput = { ...rest, jobId: uuidv4() };
        if (metadata) {
            data.metadata = metadata as JsonObject;
        }

        return data;
    });

    await prisma.$transaction(async (tx) => {
        await tx.source.createMany({ data: sources });
        await sourceQueue.addBulk(
            sources.map((s) => ({
                name: `job_${s.jobId}`,
                data: {
                    jobId: s.jobId!,
                    preset: preset.name
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
        await ragIngestionService.remove(id);
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
    const source_ids: number[] = [];

    if (payload.filters) {
        const { sql, params } = buildMetadataFilter(payload.filters);
        const sources = await prisma.$queryRawUnsafe<{ id: number }[]>(
            `SELECT id FROM "Source" WHERE ${sql}`,
            ...params
        );
        source_ids.push(...sources.map((s) => s.id));
    }

    const result = await ragSearchService.search(payload, source_ids, rerank, preset, tone);

    await searchLogQueue.add(`job_${uuidv4()}`, {
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
