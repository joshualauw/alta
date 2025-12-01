import z from "zod";
import { Preset } from "@/database/generated/prisma/client";

export const updatePresetRequest = z.object({
    name: z.string().min(1).optional(),
    chunkSplitSize: z.number().optional(),
    chunkSplitOverlap: z.number().optional(),
    topK: z.number().optional(),
    topN: z.number().optional(),
    minSimilarityScore: z.number().optional(),
    maxResponseTokens: z.number().optional(),
    rerankModel: z.string().min(1).optional(),
    responsesModel: z.string().min(1).optional()
});

export type UpdatePresetRequest = z.infer<typeof updatePresetRequest>;

export type UpdatePresetResponse = Omit<Preset, "createdAt" | "updatedAt"> & {
    updatedAt: string;
};
