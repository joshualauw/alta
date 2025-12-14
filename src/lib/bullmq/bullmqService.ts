import { Queue } from "bullmq";
import IORedis from "ioredis";
import config from "@/config";
import { CreateSourceJob } from "./types/CreateSourceJob";

export const connection = new IORedis(config.REDIS_URL, {
    maxRetriesPerRequest: null
});

export const SOURCE_QUEUE = "source";
const sourceQueue = new Queue<CreateSourceJob>(SOURCE_QUEUE, { connection });

export async function addSourceJobs(jobs: CreateSourceJob[]) {
    await sourceQueue.addBulk(
        jobs.map((job) => ({
            name: job.jobId,
            data: {
                jobId: job.jobId,
                name: job.name,
                preset: job.preset
            }
        }))
    );
}
