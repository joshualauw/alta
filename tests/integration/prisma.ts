import { beforeAll, afterAll } from "vitest";
import { PrismaClient } from "../../src/database/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { faker } from "@faker-js/faker";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
export const prisma = new PrismaClient({ adapter });

beforeAll(async () => {
    await prisma.$connect();
    console.log("prisma connected");
});

afterAll(async () => {
    await prisma.$disconnect();
    console.log("prisma disconnected");
});

export async function createGroupFactory() {
    return await prisma.group.create({
        data: {
            name: faker.company.name(),
            colorCode: faker.color.rgb({ format: "hex" })
        }
    });
}
