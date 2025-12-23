import { Job, Worker } from "bullmq";
import { connection, CreateSourceJob, SOURCE_QUEUE } from "@/lib/bullmq";
import { prisma } from "@/lib/prisma";
import logger from "@/lib/pino";
import * as pineconeService from "@/lib/pinecone";

new Worker(
    SOURCE_QUEUE,
    async (job: Job<CreateSourceJob>) => {
        logger.info({ jobId: job.id }, "processing source started");

        const source = await prisma.source.findUniqueOrThrow({
            where: { jobId: job.data.jobId }
        });

        const preset = await prisma.preset.findUniqueOrThrow({
            where: { code: job.data.preset ? job.data.preset : "default" }
        });

        try {
            await pineconeService.upsertText({ source, preset });

            await prisma.source.update({
                where: { jobId: job.data.jobId },
                data: { status: "DONE" }
            });
        } catch (error: unknown) {
            const err = error as Error;
            await prisma.source.update({
                where: { jobId: job.data.jobId },
                data: { status: "FAILED", statusReason: err.message }
            });

            throw error;
        }
    },
    { connection }
);

logger.info("source worker is running");
