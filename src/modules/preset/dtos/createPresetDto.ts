import z from "zod";

export const createPresetRequest = z.object({
    name: z.string().min(1),
    chunkSplitSize: z.number().min(100).max(2048),
    chunkSplitOverlap: z.number().min(10).max(100),
    topK: z.number().min(1).max(50),
    topN: z.number().min(1).max(10),
    minSimilarityScore: z.number().min(0).max(1),
    maxResponseTokens: z.number().min(512).max(4096),
    rerankModel: z.string().min(1),
    responsesModel: z.string().min(1)
});

export type CreatePresetRequest = z.infer<typeof createPresetRequest>;

export const createPresetResponse = z.object({
    id: z.number(),
    code: z.string(),
    name: z.string(),
    chunkSplitSize: z.number().min(100).max(2048),
    chunkSplitOverlap: z.number().min(10).max(100),
    topK: z.number().min(1).max(50),
    topN: z.number().min(1).max(10),
    minSimilarityScore: z.number().min(0).max(1),
    maxResponseTokens: z.number().min(512).max(4096),
    rerankModel: z.string(),
    responsesModel: z.string(),
    createdAt: z.string()
});

export type CreatePresetResponse = z.infer<typeof createPresetResponse>;
