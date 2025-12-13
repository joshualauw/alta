import { Queue } from "bullmq";
import IORedis from "ioredis";
import config from "@/config";
import { IngestJob } from "@/modules/source/types/IngestJob";
import { SearchLogJob } from "@/modules/analytics/types/SearchLogJob";
import { CreateSourceJob } from "./types/CreateSourceJob";
import { CreateSearchLogJob } from "./types/CreateSearchLogJob";

export const SOURCE_QUEUE = "source";
export const SEARCH_LOG_QUEUE = "search_log";

export const connection = new IORedis(config.REDIS_URL, {
    maxRetriesPerRequest: null
});

const sourceQueue = new Queue<IngestJob>(SOURCE_QUEUE, { connection });
const searchLogQueue = new Queue<SearchLogJob>(SEARCH_LOG_QUEUE, { connection });

export async function addSourceJobs(jobs: CreateSourceJob[]): Promise<void> {
    await sourceQueue.addBulk(
        jobs.map((job) => ({
            name: job.name,
            data: {
                jobId: job.jobId,
                preset: job.preset
            }
        }))
    );
}

export async function addSearchLogJob(jobId: string, job: CreateSearchLogJob): Promise<void> {
    await searchLogQueue.add(jobId, job);
}
