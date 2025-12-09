import { Queue } from "bullmq";
import IORedis from "ioredis";
import { IngestJob } from "@/modules/source/types/IngestJob";
import { SearchLogJob } from "@/modules/analytics/types/SearchLogJob";
import config from "@/config";

export const connection = new IORedis(config.REDIS_URL, {
    maxRetriesPerRequest: null
});

export const SOURCE_QUEUE = "source";
export const SEARCH_LOG_QUEUE = "search_log";

export const sourceQueue = new Queue<IngestJob>(SOURCE_QUEUE, { connection });
export const searchLogQueue = new Queue<SearchLogJob>(SEARCH_LOG_QUEUE, { connection });
