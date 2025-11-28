import dotenv from "dotenv";

dotenv.config();

export default {
    port: process.env.PORT ? Number(process.env.PORT) : 3000,
    nodeEnv: process.env.NODE_ENV || "development",

    adminEmail: process.env.ALTA_ADMIN_EMAIL || "admin@mail.com",
    adminPassword: process.env.ALTA_ADMIN_PASSWORD || "123456",

    pineconeApikey: process.env.PINECONE_API_KEY || "",
    openaiApiKey: process.env.OPENAI_API_KEY || "",

    jwtSecret: process.env.JWT_SECRET || "123456",
    jwtExpiresIn: process.env.JWT_EXPIRES_IN ? Number(process.env.JWT_EXPIRES_IN) : 3600,

    databaseUrl: process.env.DATABASE_URL || "",
};
