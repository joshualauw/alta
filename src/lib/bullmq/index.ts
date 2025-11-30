import { Queue } from "bullmq";
import IORedis from "ioredis";
import config from "@/config";

export const connection = new IORedis({
    host: config.redis.host,
    port: config.redis.port,
    maxRetriesPerRequest: null
});

export const sourceQueue = new Queue(config.redis.queueName, { connection });
