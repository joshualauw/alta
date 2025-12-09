import { Job, Worker } from "bullmq";
import { connection, SEARCH_LOG_QUEUE } from "@/lib/bullmq";
import { SearchLogJob } from "@/modules/analytics/types/SearchLogJob";
import { prisma } from "@/lib/prisma";
import { InputJsonValue } from "@prisma/client/runtime/client";
import logger from "@/lib/pino";

const worker = new Worker(
    SEARCH_LOG_QUEUE,
    async (job: Job<SearchLogJob>) => {
        logger.info({ jobId: job.id }, "processing search log started");

        await prisma.searchLog.create({
            data: {
                ...job.data,
                chunksRetrieved: job.data.chunksRetrieved as unknown as InputJsonValue[],
                chunksReranked: job.data.chunksReranked as unknown as InputJsonValue[]
            }
        });
    },
    { connection }
);

worker.on("completed", async (job: Job<SearchLogJob>) => {
    logger.info({ jobId: job.id }, "processing search log finished");
});

worker.on("failed", async (job: Job<SearchLogJob> | undefined, error) => {
    if (job) {
        logger.error({ jobId: job.id, error }, "processing search log failed");
    }
});

logger.info("search log worker is running");
