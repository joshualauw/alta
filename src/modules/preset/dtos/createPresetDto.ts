import z from "zod";
import { Preset } from "@/database/generated/prisma/client";

export const createPresetRequest = z.object({
    name: z.string().min(1),
    chunkSplitSize: z.number(),
    chunkSplitOverlap: z.number(),
    topK: z.number(),
    topN: z.number(),
    minSimilarityScore: z.number(),
    maxResponseTokens: z.number(),
    rerankModel: z.string().min(1),
    responsesModel: z.string().min(1)
});

export type CreatePresetRequest = z.infer<typeof createPresetRequest>;

export type CreatePresetResponse = Omit<Preset, "updatedAt" | "createdAt"> & {
    createdAt: string;
};
