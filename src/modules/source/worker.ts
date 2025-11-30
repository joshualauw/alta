import { Job, Worker } from "bullmq";
import config from "@/config";
import { connection } from "@/lib/bullmq";
import { prisma } from "@/lib/prisma";
import * as ragService from "@/modules/source/services/ragService";

const worker = new Worker(
    config.redis.queueName,
    async (job: Job<string>) => {
        console.log("processing source started", job.id);

        const source = await prisma.source.findUniqueOrThrow({
            where: { jobId: job.data }
        });

        await ragService.ingest(source);
    },
    { connection }
);

worker.on("completed", async (job: Job<string>) => {
    console.log("processing source finished", job.id);

    await prisma.source.update({
        where: { jobId: job.data },
        data: { status: "DONE" }
    });
});

worker.on("failed", async (job: Job<string> | undefined, err) => {
    if (job) {
        console.log("processing source failed", job?.id);

        await prisma.source.update({
            where: { jobId: job?.data },
            data: { status: "FAILED", statusReason: err.message }
        });
    }
});

console.log("worker is running");
