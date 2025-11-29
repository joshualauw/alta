import dotenv from "dotenv";

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
        create: {
            chunkSize: 400,
            chunkOverlap: 40
        },
        search: {
            topK: 5,
            minSimilarity: 0.1
        }
    }
};
