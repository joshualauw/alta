import { Worker } from "bullmq";
import { connection, QUEUE_NAME } from "@/lib/bullmq";

const worker = new Worker(
    QUEUE_NAME,
    async (job) => {
        console.log("processing source", job.id);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        console.log("processing source finished", job.id);

        return { success: true };
    },
    { connection }
);

worker.on("completed", (job) => {
    console.log(`Job ${job.id} completed!`);
});

worker.on("failed", (job, err) => {
    console.error(`Job ${job?.id} failed: ${err.message}`);
});

console.log("worker is running");
