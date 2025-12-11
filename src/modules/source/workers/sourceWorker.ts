import { Job, Worker } from "bullmq";
import { connection, SOURCE_QUEUE } from "@/lib/bullmq";
import { prisma } from "@/lib/prisma";
import * as ragService from "@/modules/source/services/ragSearchService";
import { IngestJob } from "@/modules/source/types/IngestJob";
import logger from "@/lib/pino";

const worker = new Worker(
    SOURCE_QUEUE,
    async (job: Job<IngestJob>) => {
        logger.info({ jobId: job.id }, "processing source started");

        const source = await prisma.source.findUniqueOrThrow({
            where: { jobId: job.data.jobId }
        });

        const preset = await prisma.preset.findUniqueOrThrow({
            where: { code: job.data.preset ? job.data.preset : "default" }
        });

        await ragService.ingest(source, preset);
    },
    { connection }
);

worker.on("completed", async (job: Job<IngestJob>) => {
    logger.info({ jobId: job.id }, "processing source finished");

    await prisma.source.update({
        where: { jobId: job.data.jobId },
        data: { status: "DONE" }
    });
});

worker.on("failed", async (job: Job<IngestJob> | undefined, error) => {
    if (job) {
        logger.error({ jobId: job.id, error }, "processing source failed");

        await prisma.source.update({
            where: { jobId: job.data.jobId },
            data: { status: "FAILED", statusReason: error.message }
        });
    }
});

logger.info("source worker is running");
