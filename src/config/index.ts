import dotenv from "dotenv";
import { ResponsesModel } from "openai/resources/shared";

dotenv.config();

export default {
    port: process.env.PORT ? Number(process.env.PORT) : 3000,
    nodeEnv: process.env.NODE_ENV || "development",
    database: {
        url: process.env.DATABASE_URL || ""
    },
    alta: {
        apiKey: process.env.ALTA_API_KEY || ""
    },
    pinecone: {
        apiKey: process.env.PINECONE_API_KEY || "",
        indexName: process.env.PINECONE_INDEX_NAME || ""
    },
    openai: {
        apiKey: process.env.OPENAI_API_KEY || ""
    },
    rag: {
        chunkSplitSize: 400,
        chunkSplitOverlap: 40,
        topK: 10,
        topN: 3,
        minSimilarity: 0.1,
        maxTokens: 512,
        rerankModel: "bge-reranker-v2-m3",
        translateModel: "gpt-5-mini" as ResponsesModel
    }
};
