import { ResponsesModel } from "openai/resources/shared";
import { prisma } from "@/lib/prisma";
import logger from "@/lib/pino";
import config from "@/config";
import bcrypt from "bcryptjs";

async function main() {
    const defaultPreset = await prisma.preset.findFirst({
        where: { code: "default" }
    });

    if (!defaultPreset) {
        await prisma.preset.create({
            data: {
                name: "Default",
                code: "default",
                chunkSplitSize: 400,
                chunkSplitOverlap: 40,
                topK: 10,
                topN: 3,
                minSimilarityScore: 0.1,
                maxResponseTokens: 512,
                rerankModel: "bge-reranker-v2-m3",
                responsesModel: "gpt-5-mini" as ResponsesModel
            }
        });
    }

    const adminUser = await prisma.user.findFirst({
        where: { email: config.ADMIN_EMAIL }
    });

    if (!adminUser) {
        await prisma.user.create({
            data: {
                name: "Admin",
                email: config.ADMIN_EMAIL,
                password: await bcrypt.hash(config.ADMIN_PASSWORD, 12),
                role: "ADMIN"
            }
        });
    }

    logger.info("✅ Database seeded.");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
