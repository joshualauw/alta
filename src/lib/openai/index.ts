import OpenAI from "openai";
import config from "@/config";
import { GenerateResponseParams } from "@/lib/openai/types/GenerateResponse";

export const openai = new OpenAI({
    apiKey: config.OPENAI_API_KEY
});

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

export async function generateRagResponse({ question, chunksContext, preset, tone }: GenerateResponseParams): Promise<string> {
    if (chunksContext.length === 0) {
        return "I apologize, but I could not find any relevant information in the documents to answer your question.";
    }

    const context = chunksContext.join("\n---\n");
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
