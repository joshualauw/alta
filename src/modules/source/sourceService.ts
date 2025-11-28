import config from "@/config";
import { NotFoundError } from "@/lib/internal/errors";
import { pinecone } from "@/lib/pinecone";
import { prisma } from "@/lib/prisma";
import { CreateSourceRequest, CreateSourceResponse } from "@/modules/source/dtos/createSourceDto";
import { DeleteSourceResponse } from "@/modules/source/dtos/deleteSourceDto";
import { GetAllSourceResponse } from "@/modules/source/dtos/getAllSourceDto";
import { UpdateSourceRequest, UpdateSourceResponse } from "@/modules/source/dtos/updateSourceDto";
import { chunkText, cleanText } from "@/modules/source/helpers/preprocessing";
import { pick } from "@/utils/mapper";

export async function getAllSource(): Promise<GetAllSourceResponse[]> {
    const sources = await prisma.source.findMany();

    return sources.map((s) => ({
        ...pick(s, "id", "name", "fileUrl", "createdAt"),
    }));
}

export async function createSource(payload: CreateSourceRequest): Promise<CreateSourceResponse> {
    const source = await prisma.$transaction(async (tx) => {
        const source = await prisma.source.create({
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
    const source = await prisma.source.findFirst({
        where: { id },
    });

    if (!source) throw new NotFoundError("source not found");

    const updatedSource = await prisma.source.update({
        where: { id },
        data: payload,
    });

    return { ...pick(updatedSource, "id", "name"), updatedAt: updatedSource.updatedAt.toISOString() };
}

export async function deleteSource(id: number): Promise<DeleteSourceResponse> {
    const source = await prisma.source.findFirst({
        where: { id },
    });

    if (!source) throw new NotFoundError("source not found");

    await prisma.source.delete({
        where: { id },
    });

    return { id };
}
