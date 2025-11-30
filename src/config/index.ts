import dotenv from "dotenv";

dotenv.config();

export default {
    port: process.env.PORT ? Number(process.env.PORT) : 3001,
    nodeEnv: process.env.NODE_ENV || "development",
    database: {
        url: process.env.DATABASE_URL || "postgresql://postgres:123456@localhost:5433/alta"
    },
    redis: {
        host: process.env.REDIS_HOST || "localhost",
        port: process.env.REDIS_PORT ? Number(process.env.REDIS_PORT) : 6379,
        queueName: "sources"
    },
    alta: {
        apiKey: process.env.ALTA_API_KEY || "alta_"
    },
    pinecone: {
        apiKey: process.env.PINECONE_API_KEY || "pcsk_",
        indexName: process.env.PINECONE_INDEX_NAME || "alta"
    },
    openai: {
        apiKey: process.env.OPENAI_API_KEY || "sk_"
    },
    //TODO: get config values from database
    rag: {
        namespace: "alta"
    }
};
