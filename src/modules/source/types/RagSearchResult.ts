import { Hit } from "@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch/db_data";

export interface RagSearchResult {
    answer: string;
    responseTimeMs: number;
    rerankUnitCost?: number;
    readUnitCost: number;
    embeddingTokenCost?: number;
    chunks: Hit[];
}
