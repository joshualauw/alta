import config from "@/config";
import { Preset, Source } from "@/database/generated/prisma/client";
import { pinecone } from "@/lib/pinecone";
import { SourceMetadata } from "@/modules/source/types/SourceMetadata";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { JsonObject } from "@prisma/client/runtime/client";

function cleanText(rawText: string) {
    return rawText
        .replace(/[ \t]+/g, " ") // normalize spaces
        .replace(/\r\n/g, "\n") // unify line breaks
        .replace(/\n{2,}/g, "\n\n") // max 1 newline (preserve paragraph)
        .replace(/\.{2,}/g, ".") // remove extra dots
        .replace(/[*_]{1,2}([^*_]+)[*_]{1,2}/g, "$1") // remove **bold**, *italic*, etc
        .replace(/`{1,3}([^`]+)`{1,3}/g, "$1") // remove inline or fenced code
        .replace(/^#+\s?/gm, "") // strip markdown headers
        .replace(/^\s*[-*+]\s+/gm, "") // strip list markers
        .replace(/<[^>]+>/g, "") // strip all HTML tags
        .replace(/[-_*]{3,}/g, "") // strip ASCII dividers
        .trim();
}

async function chunkText(text: string, preset: Preset) {
    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: preset.chunkSplitSize,
        chunkOverlap: preset.chunkSplitOverlap,
        separators: [". ", "\n\n", "\n", " ", ""]
    });

    const docs = await splitter.createDocuments([text]);

    return docs.map((doc) =>
        doc.pageContent
            .replace(/^\.\s*/, "")
            .replace(/\s+/g, " ")
            .trim()
    );
}

export async function ingest(source: Source, preset: Preset) {
    const text = cleanText(source.content);
    const chunks = await chunkText(text, preset);

    const index = pinecone.index(config.PINECONE_INDEX_NAME);

    const records = chunks.map((c, i) => {
        const idx = i + 1;
        const metadata: Partial<SourceMetadata> = {
            chunk_text: c,
            chunk_number: idx,
            source_id: source.id,
            source_name: source.name,
            created_at: new Date().toISOString(),
            ...(source.metadata as JsonObject)
        };

        return { _id: `source${source.id}#chunk${idx}`, ...metadata };
    });

    await index.upsertRecords(records);
}

export async function remove(sourceId: number) {
    const index = pinecone.index(config.PINECONE_INDEX_NAME);
    await index.deleteMany({ source_id: { $eq: sourceId } });
}
