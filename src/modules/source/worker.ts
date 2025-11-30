import { Job, Worker } from "bullmq";
import config from "@/config";
import { connection, QUEUE_NAME } from "@/lib/bullmq";
import { pinecone } from "@/lib/pinecone";
import { prisma } from "@/lib/prisma";
import * as ragService from "@/modules/source/ragService";
import { SourceMetadata } from "@/modules/source/types/SourceMetadata";
import { JsonObject } from "@prisma/client/runtime/client";

const worker = new Worker(
    QUEUE_NAME,
    async (job: Job<string>) => {
        console.log("processing source started", job.id);

        const source = await prisma.source.findUniqueOrThrow({
            where: { jobId: job.data }
        });

        const cleanedText = ragService.cleanText(source.content);
        const chunks = await ragService.chunkText(cleanedText);

        const index = pinecone.index(config.pinecone.indexName).namespace("alta");

        const records = chunks.map((c, i) => {
            const idx = i + 1;
            const metadata: SourceMetadata = {
                chunk_text: c,
                chunk_number: idx,
                source_id: source.id,
                source_name: source.name,
                created_at: new Date().toISOString(),
                ...(source.metadata as JsonObject)
            };

            return { _id: `source${source.id}#chunk${idx}`, ...metadata };
        });

        await index.upsertRecords(records);
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
