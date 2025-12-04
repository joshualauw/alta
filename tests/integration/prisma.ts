import { beforeAll, afterAll } from "vitest";
import { PrismaClient } from "../../src/database/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { faker } from "@faker-js/faker";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
export const prisma = new PrismaClient({ adapter });

beforeAll(async () => {
    await prisma.$connect();
    console.log("prisma connected");
});

afterAll(async () => {
    await prisma.$disconnect();
    console.log("prisma disconnected");
});

export async function createGroupFactory() {
    return await prisma.group.create({
        data: {
            name: faker.company.name(),
            colorCode: faker.color.rgb({ format: "hex" })
        }
    });
}

export async function createPresetFactory() {
    const rerankModels = ["bge-reranker-v2-m3", "cross-encoder-v2"];
    const responseModels = ["gpt-5-mini", "llama-3-8b", "claude-3-opus"];

    return await prisma.preset.create({
        data: {
            name: faker.commerce.productName(),
            code: faker.string.uuid().substring(0, 8),
            chunkSplitSize: faker.number.int({ min: 256, max: 1024 }),
            chunkSplitOverlap: faker.number.int({ min: 10, max: 100 }),
            topK: faker.number.int({ min: 5, max: 20 }),
            topN: faker.number.int({ min: 1, max: 5 }),
            minSimilarityScore: faker.number.float({ min: 0.1, max: 0.9 }),
            maxResponseTokens: faker.number.int({ min: 256, max: 1024 }),
            rerankModel: faker.helpers.arrayElement(rerankModels),
            responsesModel: faker.helpers.arrayElement(responseModels)
        }
    });
}
