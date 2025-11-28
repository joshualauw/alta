import config from "@/config";
import { NotFoundError } from "@/lib/internal/errors";
import { pinecone } from "@/lib/pinecone";
import { prisma } from "@/lib/prisma";
import { CreateSourceRequest, CreateSourceResponse } from "@/modules/source/dtos/createSourceDto";
import { DeleteSourceResponse } from "@/modules/source/dtos/deleteSourceDto";
import { GetAllSourceResponse } from "@/modules/source/dtos/getAllSourceDto";
import { GetSourceDetailResponse } from "@/modules/source/dtos/getSourceDetailDto";
import { SearchSourceRequest, SearchSourceResponse } from "@/modules/source/dtos/searchSourceDto";
import { UpdateSourceRequest, UpdateSourceResponse } from "@/modules/source/dtos/updateSourceDto";
import { chunkText, cleanText } from "@/modules/source/helpers/preprocessing";
import { getAnswerFromChunks } from "@/modules/source/helpers/translator";
import { omit, pick } from "@/utils/mapper";

export async function getAllSource(): Promise<GetAllSourceResponse[]> {
    const sources = await prisma.source.findMany();

    return sources.map((s) => ({
        ...pick(s, "id", "name", "fileUrl", "createdAt"),
    }));
}

export async function getSourceDetail(id: number): Promise<GetSourceDetailResponse> {
    const source = await prisma.source.findFirstOrThrow({
        where: { id },
    });

    return { ...omit(source, "createdAt", "updatedAt"), createdAt: source.createdAt.toISOString() };
}

export async function createSource(payload: CreateSourceRequest): Promise<CreateSourceResponse> {
    const source = await prisma.$transaction(async (tx) => {
        const source = await tx.source.create({
            data: payload,
        });

        const cleanedText = cleanText(payload.content);
        const chunks = await chunkText(cleanedText);

        const index = pinecone.index(config.pinecone.indexName).namespace("alta");
        const records = chunks.map((c, i) => ({
            _id: `source${source.id}#chunk${i}`,
            chunk_text: c,
            chunk_number: i,
            source_id: source.id,
            source_name: source.name,
            created_at: new Date().toISOString(),
        }));

        await index.upsertRecords(records);

        return source;
    });

    return { ...pick(source, "id", "name"), createdAt: source.createdAt.toISOString() };
}

export async function updateSource(id: number, payload: UpdateSourceRequest): Promise<UpdateSourceResponse> {
    const updatedSource = await prisma.source.update({
        where: { id },
        data: payload,
    });

    return { ...pick(updatedSource, "id", "name"), updatedAt: updatedSource.updatedAt.toISOString() };
}

export async function deleteSource(id: number): Promise<DeleteSourceResponse> {
    await prisma.$transaction(async (tx) => {
        await tx.source.delete({
            where: { id },
        });

        const index = pinecone.index(config.pinecone.indexName).namespace("alta");
        await index.deleteMany({ source_id: { $eq: id } });
    });

    return { id };
}

export async function searchSource(payload: SearchSourceRequest): Promise<SearchSourceResponse> {
    const index = pinecone.index(config.pinecone.indexName).namespace("alta");

    const result = await index.searchRecords({
        query: {
            topK: 5,
            inputs: { text: payload.question },
            filter: { source_id: { $in: payload.sourceIds } },
        },
    });

    const chunks = result.result.hits.filter((c) => c._score > 0.1);
    const preparedChunks = chunks.sort((c) => (c.fields as any).chunk_number).map((c) => (c.fields as any).chunk_text);

    const answer = await getAnswerFromChunks(preparedChunks, payload.question);

    return { answer, references: chunks.map((c) => c._id) };
}
