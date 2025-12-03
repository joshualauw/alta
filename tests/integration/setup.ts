import { execSync } from "child_process";
import { PostgreSqlContainer, StartedPostgreSqlContainer } from "@testcontainers/postgresql";
import { RedisContainer, StartedRedisContainer } from "@testcontainers/redis";
import { afterAll, beforeAll } from "vitest";

export interface PostgresConfig {
    uri: string;
    host: string;
    port: number;
    user: string;
    password: string;
    database: string;
}

export interface RedisConfig {
    host: string;
    port: number;
}

export let postgresConfig: PostgresConfig;
export let redisConfig: RedisConfig;

let pgContainer: StartedPostgreSqlContainer;
let redisContainer: StartedRedisContainer;

beforeAll(async () => {
    pgContainer = await new PostgreSqlContainer("postgres:15")
        .withDatabase("testdb")
        .withUsername("postgres")
        .withPassword("password")
        .start();

    postgresConfig = {
        uri: pgContainer.getConnectionUri(),
        host: pgContainer.getHost(),
        port: pgContainer.getPort(),
        user: pgContainer.getUsername(),
        password: pgContainer.getPassword(),
        database: pgContainer.getDatabase()
    };

    const databaseUrl = pgContainer.getConnectionUri();
    process.env.DATABASE_URL = databaseUrl;

    execSync("npx prisma migrate deploy", {
        env: { ...process.env, DATABASE_URL: databaseUrl }
    });

    execSync("npx prisma db seed", {
        env: { ...process.env }
    });

    redisContainer = await new RedisContainer("redis:7-alpine").start();

    redisConfig = {
        host: redisContainer.getHost(),
        port: redisContainer.getPort()
    };
}, 30000);

afterAll(async () => {
    await pgContainer.stop();
    await redisContainer.stop();
}, 30000);

module.exports = {};
