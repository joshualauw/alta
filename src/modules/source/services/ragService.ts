import config from "@/config";
import { Preset, Source } from "@/database/generated/prisma/client";
import { openai } from "@/lib/openai";
import { pinecone } from "@/lib/pinecone";
import { SearchSourceRequest, SearchSourceResponse } from "@/modules/source/dtos/searchSourceDto";
import { SourceMetadata } from "@/modules/source/types/SourceMetadata";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { SearchRecordsOptions } from "@pinecone-database/pinecone/dist/data";
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

async function createAnswer(chunks: string[], question: string, preset: Preset): Promise<string> {
    if (chunks.length === 0) {
        return "I apologize, but I could not find any relevant information in the documents to answer your question.";
    }

    const context = chunks.join("\n---\n");

    const systemPrompt = `
        You are an expert Q&A assistant for a Retrieval-Augmented Generation (RAG) system.
        Your task is to synthesize a single, concise, and helpful answer to the user's question.

        RULES:
        1. Use ONLY the provided context snippets below to answer the question.
        2. If the answer cannot be fully found in the provided context, you MUST state that you do not have enough information from the documents.
        3. Do not introduce outside knowledge.
        4. Maintain a professional and friendly tone.
    `;

    const userMessage = `
        CONTEXT SNIPPETS:
        ---
        ${context}
        ---
        USER QUESTION: ${question}
    `;

    const completion = await openai.chat.completions.create({
        model: preset.responsesModel,
        messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userMessage }
        ],
        max_completion_tokens: preset.maxResponseTokens
    });

    return completion.choices[0].message.content?.trim() || "";
}

export async function ingest(source: Source, preset: Preset) {
    const cleanedText = cleanText(source.content);
    const chunks = await chunkText(cleanedText, preset);

    const index = pinecone.index(config.pinecone.indexName).namespace(config.rag.namespace);

    const records = chunks.map((c, i) => {
        const idx = i + 1;
        const metadata: SourceMetadata = {
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

export async function search(
    payload: SearchSourceRequest,
    rerank: boolean,
    preset: Preset
): Promise<SearchSourceResponse> {
    const index = pinecone.index(config.pinecone.indexName).namespace(config.rag.namespace);

    const options: SearchRecordsOptions = {
        query: {
            topK: preset.topK,
            inputs: { text: payload.question },
            filter: payload.filters
        }
    };

    if (rerank) {
        options.rerank = {
            model: preset.rerankModel,
            rankFields: ["chunk_text"],
            topN: preset.topN
        };
    }

    const result = await index.searchRecords(options);

    const chunks = rerank ? result.result.hits : result.result.hits.filter((c) => c._score > preset.minSimilarityScore);

    const answer = await createAnswer(
        chunks.map((c) => (c.fields as SourceMetadata).chunk_text),
        payload.question,
        preset
    );

    return { answer, references: chunks.map((c) => c._id) };
}

export async function remove(sourceId: number) {
    const index = pinecone.index(config.pinecone.indexName).namespace(config.rag.namespace);
    await index.deleteMany({ source_id: { $eq: sourceId } });
}
