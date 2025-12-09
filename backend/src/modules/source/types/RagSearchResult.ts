export interface RagSearchResult {
    answer: string;
    responseTimeMs: number;
    rerankUnitCost?: number;
    readUnitCost: number;
    embeddingTokenCost?: number;
    chunksRetrieved: ChunksRetrieved[];
    chunksReranked: ChunksReranked[];
    chunksReferences: string[];
}

export interface ChunksRetrieved {
    id: string;
    similarityScore: number;
}

export interface ChunksReranked {
    id: string;
    relevanceScore: number;
}
