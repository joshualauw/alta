import { ResponsesModel } from "openai/resources/shared";
import { prisma } from "@/lib/prisma";
import logger from "@/lib/pino";

async function main() {
    const defaultPreset = await prisma.preset.findFirst({
        where: { code: "default" }
    });

    if (defaultPreset) {
        logger.warn("default preset already exist");
        process.exit(1);
    }

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

    logger.info("✅ Preset 'Default' seeded.");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
