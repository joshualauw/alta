import config from "@/config";
import { SourceCreateInput, SourceWhereInput } from "@/database/generated/prisma/models";
import { pinecone } from "@/lib/pinecone";
import { prisma } from "@/lib/prisma";
import { CreateSourceRequest, CreateSourceResponse } from "@/modules/source/dtos/createSourceDto";
import { DeleteSourceResponse } from "@/modules/source/dtos/deleteSourceDto";
import { GetAllSourceQuery, GetAllSourceResponse } from "@/modules/source/dtos/getAllSourceDto";
import { GetSourceDetailResponse } from "@/modules/source/dtos/getSourceDetailDto";
import { SearchSourceRequest, SearchSourceResponse } from "@/modules/source/dtos/searchSourceDto";
import { UpdateSourceRequest, UpdateSourceResponse } from "@/modules/source/dtos/updateSourceDto";
import { chunkText, cleanText } from "@/modules/source/helpers/preprocessing";
import { getAnswerFromChunks } from "@/modules/source/helpers/translator";
import { SourceMetadata } from "@/modules/source/types/SourceMetadata";
import { pick } from "@/utils/mapper";
import { SearchRecordsOptions } from "@pinecone-database/pinecone/dist/data";
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
        ...pick(s, "id", "name", "fileUrl"),
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
        ...pick(source, "id", "name", "content", "fileUrl"),
        groupId: source.groupId,
        groupName: source.group?.name ?? null,
        createdAt: source.createdAt.toISOString()
    };
}

export async function createSource(payload: CreateSourceRequest): Promise<CreateSourceResponse> {
    const source = await prisma.$transaction(async (tx) => {
        const { metadata, ...rest } = payload;
        const data: SourceCreateInput = { ...rest };

        if (metadata) {
            data.metadata = metadata as JsonObject;
        }

        const source = await tx.source.create({ data });

        const cleanedText = cleanText(payload.content);
        const chunks = await chunkText(cleanedText);

        const index = pinecone.index(config.pinecone.indexName).namespace("alta");

        const records = chunks.map((c, i) => {
            const metadata: SourceMetadata = {
                chunk_text: c,
                chunk_number: i,
                source_id: source.id,
                source_name: source.name,
                created_at: new Date().toISOString(),
                ...payload.metadata
            };
            return { _id: `source${source.id}#chunk${i}`, ...metadata };
        });

        await index.upsertRecords(records);

        return source;
    });

    return { ...pick(source, "id", "name"), createdAt: source.createdAt.toISOString() };
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

        const index = pinecone.index(config.pinecone.indexName).namespace("alta");
        await index.deleteMany({ source_id: { $eq: id } });
    });

    return { id };
}

export async function searchSource(payload: SearchSourceRequest): Promise<SearchSourceResponse> {
    const index = pinecone.index(config.pinecone.indexName).namespace("alta");

    const options: SearchRecordsOptions = {
        query: {
            topK: config.rag.topK,
            inputs: { text: payload.question },
            filter: payload.filters
        }
    };

    if (payload.rerank) {
        options.rerank = {
            model: config.rag.rerankModel,
            rankFields: ["chunk_text"],
            topN: config.rag.topN
        };
    }

    const result = await index.searchRecords(options);

    const chunks = result.result.hits.filter((c) => c._score > config.rag.minSimilarity);

    const preparedChunks = chunks
        .sort((c) => (c.fields as SourceMetadata).chunk_number)
        .map((c) => (c.fields as SourceMetadata).chunk_text);

    const answer = await getAnswerFromChunks(preparedChunks, payload.question);

    return { answer, references: chunks.map((c) => c._id) };
}
