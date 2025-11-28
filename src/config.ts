import dotenv from "dotenv";

dotenv.config();

export default {
    port: process.env.PORT ? Number(process.env.PORT) : 3000,
    nodeEnv: process.env.NODE_ENV || "development",
    database: {
        url: process.env.DATABASE_URL || "",
    },
    admin: {
        email: process.env.ALTA_ADMIN_EMAIL || "admin@mail.com",
        password: process.env.ALTA_ADMIN_PASSWORD || "123456",
    },
    pinecone: {
        apiKey: process.env.PINECONE_API_KEY || "",
        indexName: process.env.PINECONE_INDEX_NAME || "",
    },
    openai: {
        apiKey: process.env.OPENAI_API_KEY || "",
    },
    jwt: {
        secret: process.env.JWT_SECRET || "123456",
        expiresIn: process.env.JWT_EXPIRES_IN ? Number(process.env.JWT_EXPIRES_IN) : 3600,
    },
};
