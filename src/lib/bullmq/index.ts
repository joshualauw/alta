import { Queue } from "bullmq";
import IORedis from "ioredis";
import config from "@/config";
import { IngestJob } from "@/modules/source/types/IngestJob";
import { SearchLogJob } from "@/modules/analytics/types/SearchLogJob";

export const connection = new IORedis({
    host: config.redis.host,
    port: config.redis.port,
    maxRetriesPerRequest: null
});

export const SOURCE_QUEUE = "source";
export const SEARCH_LOG_QUEUE = "search_log";

export const sourceQueue = new Queue<IngestJob>(SOURCE_QUEUE, { connection });
export const searchLogQueue = new Queue<SearchLogJob>(SEARCH_LOG_QUEUE, { connection });
