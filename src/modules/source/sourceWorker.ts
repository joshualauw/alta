import { Job, Worker } from "bullmq";
import config from "@/config";
import { connection } from "@/lib/bullmq";
import { prisma } from "@/lib/prisma";
import * as ragService from "@/modules/source/services/ragService";
import { IngestJob } from "@/modules/source/types/IngestJob";

const worker = new Worker(
    config.redis.queueName,
    async (job: Job<IngestJob>) => {
        console.log("processing source started", job.id);

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
    console.log("processing source finished", job.id);

    await prisma.source.update({
        where: { jobId: job.data.jobId },
        data: { status: "DONE" }
    });
});

worker.on("failed", async (job: Job<IngestJob> | undefined, err) => {
    if (job) {
        console.log("processing source failed", job.id);

        await prisma.source.update({
            where: { jobId: job.data.jobId },
            data: { status: "FAILED", statusReason: err.message }
        });
    }
});

console.log("source worker is running");
