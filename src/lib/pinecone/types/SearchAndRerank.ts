import { Preset } from "@/database/generated/prisma/client";

export interface SearchAndRerankParams {
    question: string;
    sourceIds: number[];
    preset: Preset;
    rerank: boolean;
}

export interface ChunkResult {
    id: string;
    content: string;
}

export type SearchAndRerankResult = ChunkResult[];
