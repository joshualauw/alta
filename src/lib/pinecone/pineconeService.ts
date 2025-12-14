import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { RerankOptions, RerankResult, SearchRecordsResponse } from "@pinecone-database/pinecone";
import { Index, RecordMetadata, SearchRecordsQuery } from "@pinecone-database/pinecone/dist/data";
import { Hit } from "@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch/db_data";
import { UpsertTextParams } from "./types/UpsertText";
import { ChunkResult, SearchAndRerankParams, SearchAndRerankResult } from "./types/SearchAndRerank";
import { SourceMetadata } from "@/lib/pinecone/types/SourceMetadata";
import { Pinecone } from "@pinecone-database/pinecone";
import config from "@/config";

export const pinecone = new Pinecone({
    apiKey: config.PINECONE_API_KEY
});

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

async function chunkText(text: string, chunkSize: number, chunkOverlap: number) {
    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize,
        chunkOverlap,
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

export async function upsertText({ source, preset }: UpsertTextParams) {
    const text = cleanText(source.content);
    const chunks = await chunkText(text, preset.chunkSplitSize, preset.chunkSplitOverlap);

    const index = pinecone.index(config.PINECONE_INDEX_NAME);

    const records = chunks.map((c, i) => {
        const idx = i + 1;
        const meta: Partial<SourceMetadata> = {
            chunk_text: c,
            chunk_number: idx,
            source_id: source.id,
            source_name: source.name,
            created_at: new Date().toISOString()
        };

        return { _id: `source${source.id}#chunk${idx}`, ...meta };
    });

    await index.upsertRecords(records);
}

export async function deleteByFilter(filter: object) {
    const index = pinecone.index(config.PINECONE_INDEX_NAME);
    await index.deleteMany(filter);
}

async function searchRecords(
    index: Index<RecordMetadata>,
    question: string,
    topK: number,
    source_ids: number[]
): Promise<SearchRecordsResponse> {
    const query: SearchRecordsQuery = {
        topK,
        inputs: { text: question }
    };
    if (source_ids.length > 0) {
        query.filter = { source_id: { $in: source_ids } };
    }

    return await index.searchRecords({ query });
}

async function rerankRecords(hits: Hit[], topN: number, rerankModel: string, question: string): Promise<RerankResult> {
    const chunksToRerank = hits.map((c) => ({
        id: c._id,
        chunk_text: (c.fields as SourceMetadata).chunk_text
    }));

    const options: RerankOptions = {
        rankFields: ["chunk_text"],
        topN: topN,
        returnDocuments: true,
        parameters: {
            truncate: "END"
        }
    };

    return await pinecone.inference.rerank(rerankModel, question, chunksToRerank, options);
}

export async function searchAndRerank({ question, sourceIds, preset, rerank }: SearchAndRerankParams): Promise<SearchAndRerankResult> {
    const index = pinecone.index(config.PINECONE_INDEX_NAME);

    const result = await searchRecords(index, question, preset.topK, sourceIds);

    const chunks = result.result.hits.filter((c) => c._score > preset.minSimilarityScore);

    let finalChunks: ChunkResult[] = chunks.map((c) => ({
        id: c._id,
        content: (c.fields as SourceMetadata).chunk_text
    }));

    if (rerank) {
        const rerankResult = await rerankRecords(chunks, preset.topN, preset.rerankModel, question);
        finalChunks = rerankResult.data.map((c) => ({
            id: (c.document as SourceMetadata)._id,
            content: (c.document as SourceMetadata).chunk_text
        }));
    }

    return finalChunks;
}
