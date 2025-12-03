import { execSync } from "child_process";
import { PostgreSqlContainer, StartedPostgreSqlContainer } from "@testcontainers/postgresql";
import { RedisContainer, StartedRedisContainer } from "@testcontainers/redis";

declare global {
    var pgContainer: StartedPostgreSqlContainer;
    var redisContainer: StartedRedisContainer;
}

export async function setup() {
    globalThis.pgContainer = await new PostgreSqlContainer("postgres:15")
        .withDatabase("testdb")
        .withUsername("test")
        .withPassword("test")
        .start();

    process.env.DATABASE_URL = pgContainer.getConnectionUri();

    execSync("npx prisma migrate deploy");
    execSync("npx prisma db seed");

    globalThis.redisContainer = await new RedisContainer("redis:7-alpine").start();

    process.env.REDIS_PORT = globalThis.redisContainer.getPort().toString();
    process.env.REDIS_HOST = globalThis.redisContainer.getHost();

    console.log("testcontainer started");
}

export async function teardown() {
    await globalThis.pgContainer.stop();
    await globalThis.redisContainer.stop();

    console.log("testcontainer stopped");
}
