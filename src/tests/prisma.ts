import { PrismaClient } from "@/database/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { faker } from "@faker-js/faker";
import logger from "@/lib/pino";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
export const prisma = new PrismaClient({ adapter });

export async function setup() {
    await prisma.$connect();
    logger.info("prisma connected");
}

export async function teardown() {
    await prisma.$disconnect();
    logger.info("prisma disconnected");
}

export async function createGroupFactory() {
    return await prisma.group.create({
        data: {
            name: faker.company.name(),
            colorCode: faker.color.rgb({ format: "hex" })
        }
    });
}

export async function createSourceFactory() {
    return await prisma.source.create({
        data: {
            name: faker.lorem.words({ min: 3, max: 7 }),
            content: faker.lorem.paragraphs({ min: 5, max: 15 }),
            status: "DONE",
            metadata: { property: "test" }
        }
    });
}

export async function createPresetFactory() {
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
            rerankModel: faker.commerce.productName(),
            responsesModel: faker.commerce.productName()
        }
    });
}
