import { Preset } from "@/database/generated/prisma/client";
import { FilterSchema } from "@/modules/source/dtos/searchSourceDto";
import { Hit } from "@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch/db_data";

export interface SearchLogJob {
    question: string;
    answer: string;
    responseTimeMs: number;
    isRerank: boolean;
    tone: string;
    rerankUnitCost?: number;
    readUnitCost: number;
    embeddingTokenCost?: number;
    chunksRetrieved: Pick<Hit, "_id" | "_score">[];
    searchOptions: Omit<Preset, "id" | "name" | "code" | "createdAt" | "updatedAt">;
    metadataFilters?: FilterSchema;
}
