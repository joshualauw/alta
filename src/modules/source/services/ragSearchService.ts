import config from "@/config";
import { Preset } from "@/database/generated/prisma/client";
import { openai } from "@/lib/openai";
import { pinecone } from "@/lib/pinecone";
import { SearchSourceRequest } from "@/modules/source/dtos/searchSourceDto";
import { AnswerTone } from "@/modules/source/types/AnswerTone";
import { ChunksReranked, RagSearchResult } from "@/modules/source/types/RagSearchResult";
import { SourceMetadata } from "@/modules/source/types/SourceMetadata";
import { RerankOptions, RerankResult, SearchRecordsResponse } from "@pinecone-database/pinecone";
import { Index, RecordMetadata, SearchRecordsQuery } from "@pinecone-database/pinecone/dist/data";
import { Hit } from "@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch/db_data";

function buildAnswerPrompt(question: string, context: string, tone: string): [string, string] {
    const systemPrompt = `
        You are an expert Q&A assistant for a Retrieval-Augmented Generation (RAG) system.
        Your task is to synthesize helpful answer to the user's question.

        RULES:
        1. Use ONLY the provided context snippets below to answer the question.
        2. If the answer cannot be fully found in the provided context, you MUST state that you do not have enough information from the documents.
        3. Do not introduce outside knowledge.
        
        TONE: ${tone}
        The style of your answer must be dictated by the provided TONE above
        1. normal: Maintain a professional, conversational, and friendly tone. Focus on clarity and directness. Use contractions and aim for a single, easy-to-read paragraph unless complexity requires more.
        2. concise: Be extremely brief. Focus only on core facts and keywords. Use bullet points or numbered lists where possible to maximize density. Minimize transitional sentences and unnecessary words.
        3. explanatory: Provide detailed, in-depth information. Explain the WHY and HOW. Use analogies or examples (if present in the context) to elaborate on concepts.
        4. formal: Maintain a highly professional, academic, and objective tone. Avoid contractions and use precise, standardized terminology. Structure the response using clear, logical sections.   
    `;

    const userPrompt = `
        CONTEXT SNIPPETS:
        ---
        ${context}
        ---
        USER QUESTION: ${question}
    `;

    return [systemPrompt, userPrompt];
}

async function createAnswer(chunks: string[], question: string, preset: Preset, tone: AnswerTone): Promise<string> {
    if (chunks.length === 0) {
        return "I apologize, but I could not find any relevant information in the documents to answer your question.";
    }

    const context = chunks.join("\n---\n");
    const [systemPrompt, userPrompt] = buildAnswerPrompt(question, context, tone);

    const completion = await openai.chat.completions.create({
        model: preset.responsesModel,
        messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt }
        ],
        max_completion_tokens: preset.maxResponseTokens
    });

    return completion.choices[0].message.content?.trim() || "";
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

export async function search(
    payload: SearchSourceRequest,
    source_ids: number[],
    rerank: boolean,
    preset: Preset,
    tone: AnswerTone
): Promise<RagSearchResult> {
    const startTime = Date.now();
    const index = pinecone.index(config.PINECONE_INDEX_NAME);

    const result = await searchRecords(index, payload.question, preset.topK, source_ids);

    const filteredChunks = result.result.hits.filter((c) => c._score > preset.minSimilarityScore);
    const chunksRetrieved = filteredChunks.map((c) => ({ id: c._id, similarityScore: c._score }));

    let chunksContext: string[] = filteredChunks.map((c) => (c.fields as SourceMetadata).chunk_text);
    let chunksReferences: string[] = filteredChunks.map((c) => c._id);
    let chunksReranked: ChunksReranked[] = [];

    let rerankUnitCost: number | undefined = undefined;
    const embeddingTokenCost: number | undefined = result.usage.embedTotalTokens;
    const readUnitCost: number = result.usage.readUnits;

    if (rerank) {
        const rerankResult = await rerankRecords(filteredChunks, preset.topN, preset.rerankModel, payload.question);

        chunksContext = rerankResult.data.map((r) => (r.document as SourceMetadata).chunk_text);
        chunksReferences = rerankResult.data.map((r) => (r.document as SourceMetadata).id);

        rerankUnitCost = rerankResult.usage.rerankUnits;
        chunksReranked = rerankResult.data.map((r) => ({
            id: (r.document as SourceMetadata).id,
            relevanceScore: r.score
        }));
    }

    const answer = await createAnswer(chunksContext, payload.question, preset, tone);

    const endTime = Date.now();
    const responseTimeMs = endTime - startTime;

    return {
        answer,
        readUnitCost,
        embeddingTokenCost,
        rerankUnitCost,
        responseTimeMs,
        chunksReranked,
        chunksRetrieved,
        chunksReferences
    };
}
