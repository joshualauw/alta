import { Job, Worker } from "bullmq";
import { connection, CreateSourceJob, SOURCE_QUEUE } from "@/lib/bullmq";
import { prisma } from "@/lib/prisma";
import logger from "@/lib/pino";
import * as pineconeService from "@/lib/pinecone";

const worker = new Worker(
    SOURCE_QUEUE,
    async (job: Job<CreateSourceJob>) => {
        logger.info({ jobId: job.id }, "processing source started");

        const source = await prisma.source.findUniqueOrThrow({
            where: { jobId: job.data.jobId }
        });

        const preset = await prisma.preset.findUniqueOrThrow({
            where: { code: job.data.preset ? job.data.preset : "default" }
        });

        await pineconeService.upsertText({ source, preset });
    },
    { connection }
);

worker.on("completed", async (job: Job<CreateSourceJob>) => {
    logger.info({ jobId: job.id }, "processing source finished");

    await prisma.source.update({
        where: { jobId: job.data.jobId },
        data: { status: "DONE" }
    });
});

worker.on("failed", async (job: Job<CreateSourceJob> | undefined, error) => {
    if (job) {
        logger.error({ jobId: job.id, error }, "processing source failed");

        await prisma.source.update({
            where: { jobId: job.data.jobId },
            data: { status: "FAILED", statusReason: error.message }
        });
    }
});

logger.info("source worker is running");
