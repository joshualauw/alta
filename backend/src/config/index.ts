import "dotenv/config";
import z from "zod";

const configSchema = z.object({
    PORT: z.coerce.number().min(1024).max(65535).default(3001),
    NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
    ADMIN_EMAIL: z.string().min(1),
    ADMIN_PASSWORD: z.string().min(3),
    JWT_SECRET: z.string(),
    JWT_EXPIRES_IN: z.coerce.number().min(1).default(86400),
    DATABASE_URL: z.string().min(1),
    RATE_LIMIT_WINDOW: z.coerce.number().min(1000).default(300000),
    RATE_LIMIT_MAX_REC: z.coerce.number().min(1).default(100),
    FRONTEND_URL: z.string().min(1),
    REDIS_HOST: z.string().min(1),
    REDIS_PORT: z.coerce.number().min(1).default(6379),
    ALTA_API_KEY: z.string().min(1),
    PINECONE_API_KEY: z.string().min(1),
    PINECONE_INDEX_NAME: z.string().min(1),
    OPENAI_API_KEY: z.string().min(1)
});

const config = configSchema.parse(process.env);

export default config;
