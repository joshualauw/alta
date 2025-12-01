import { Job, Worker } from "bullmq";
import { connection, SEARCH_LOG_QUEUE } from "@/lib/bullmq";
import { SearchLogJob } from "@/modules/analytics/types/SearchLogJob";
import { prisma } from "@/lib/prisma";

const worker = new Worker(
    SEARCH_LOG_QUEUE,
    async (job: Job<SearchLogJob>) => {
        console.log("processing search log started", job.id);

        await prisma.searchLog.create({
            data: job.data
        });
    },
    { connection }
);

worker.on("completed", async (job: Job<SearchLogJob>) => {
    console.log("processing search log finished", job.id);
});

worker.on("failed", async (job: Job<SearchLogJob> | undefined, err) => {
    if (job) {
        console.log("processing search log failed", job.id, err.message);
    }
});

console.log("search log worker is running");
