import config from "@/config";
import { openai } from "@/lib/openai";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: config.rag.chunkSplitSize,
    chunkOverlap: config.rag.chunkSplitOverlap,
    separators: [". ", "\n\n", "\n", " ", ""]
});

export function cleanText(rawText: string) {
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

export async function chunkText(text: string) {
    const docs = await splitter.createDocuments([text]);

    return docs.map((doc) =>
        doc.pageContent
            .replace(/^\.\s*/, "")
            .replace(/\s+/g, " ")
            .trim()
    );
}

export async function getAnswerFromChunks(chunks: string[], question: string): Promise<string> {
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
        model: config.rag.translateModel,
        messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userMessage }
        ],
        max_completion_tokens: config.rag.maxTokens
    });

    return completion.choices[0].message.content?.trim() || "";
}
