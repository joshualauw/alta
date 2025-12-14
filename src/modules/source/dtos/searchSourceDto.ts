import z from "zod";

export const searchSourceRequest = z.object({
    question: z.string().min(1),
    sourceIds: z.array(z.number()).min(1)
});

export type SearchSourceRequest = z.infer<typeof searchSourceRequest>;

export const searchSourceQuery = z.object({
    rerank: z.enum(["0", "1"]).optional(),
    preset: z.string().optional(),
    tone: z.enum(["normal", "concise", "explanatory", "formal"]).optional()
});

export type SearchSourceQuery = z.infer<typeof searchSourceQuery>;

export const searchSourceResponse = z.object({
    answer: z.string(),
    references: z.array(z.string())
});

export type SearchSourceResponse = z.infer<typeof searchSourceResponse>;
