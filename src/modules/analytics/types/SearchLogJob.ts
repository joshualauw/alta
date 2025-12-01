import { Preset } from "@/database/generated/prisma/client";
import { FilterSchema } from "@/modules/source/dtos/searchSourceDto";
import { ChunksReranked, ChunksRetrieved } from "@/modules/source/types/RagSearchResult";

export interface SearchLogJob {
    question: string;
    answer: string;
    responseTimeMs: number;
    isRerank: boolean;
    tone: string;
    rerankUnitCost?: number;
    readUnitCost: number;
    embeddingTokenCost?: number;
    chunksRetrieved: ChunksRetrieved[];
    chunksReranked: ChunksReranked[];
    searchOptions: Omit<Preset, "id" | "name" | "code" | "createdAt" | "updatedAt">;
    metadataFilters?: FilterSchema;
}
