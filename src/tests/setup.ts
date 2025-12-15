import { execSync } from "child_process";
import { PostgreSqlContainer, StartedPostgreSqlContainer } from "@testcontainers/postgresql";
import logger from "@/lib/pino";

declare global {
    var pgContainer: StartedPostgreSqlContainer;
}

export async function setup() {
    process.env.NODE_ENV = "test";
    process.env.ALTA_API_KEY = "SomeApiKey";

    globalThis.pgContainer = await new PostgreSqlContainer("postgres:15")
        .withDatabase("testdb")
        .withUsername("test")
        .withPassword("test")
        .start();

    process.env.DATABASE_URL = globalThis.pgContainer.getConnectionUri();

    execSync("npx prisma migrate deploy");
    execSync("npx prisma db seed");

    logger.info("testcontainer started");
}

export async function teardown() {
    await globalThis.pgContainer.stop();

    logger.info("testcontainer stopped");
}
