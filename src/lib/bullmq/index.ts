import { Queue } from "bullmq";
import IORedis from "ioredis";
import config from "@/config";
import { IngestJob } from "@/modules/source/types/IngestJob";

export const connection = new IORedis({
    host: config.redis.host,
    port: config.redis.port,
    maxRetriesPerRequest: null
});

export const sourceQueue = new Queue<IngestJob>(config.redis.queueName, { connection });
