import "dotenv/config";
import z from "zod";

const configSchema = z.object({
    PORT: z.coerce.number().min(1024).max(65535).default(3001),
    NODE_ENV: z.enum(["development", "production", "test"]).default("development"),

    JWT_SECRET: z.string(),
    JWT_EXPIRES_IN: z.coerce.number().min(1).default(86400),

    DATABASE_URL: z.string(),
    REDIS_URL: z.string(),

    RATE_LIMIT_WINDOW: z.coerce.number().min(1000).default(300000),
    RATE_LIMIT_MAX_REC: z.coerce.number().default(100),

    R2_ACCOUNT_ID: z.string(),
    R2_API_TOKEN: z.string(),
    R2_ACCESS_KEY: z.string(),
    R2_SECRET_ACCESS_KEY: z.string(),
    R2_BUCKET_NAME: z.string().default("alta"),
    R2_ENDPOINT: z.string(),
    R2_PUBLIC_URL: z.string(),

    FRONTEND_URL: z.string(),

    ALTA_API_KEY: z.string(),

    ADMIN_EMAIL: z.string().min(1),
    ADMIN_PASSWORD: z.string().min(1),

    PINECONE_API_KEY: z.string(),
    PINECONE_INDEX_NAME: z.string(),

    OPENAI_API_KEY: z.string()
});

const config = configSchema.parse(process.env);

export default config;
