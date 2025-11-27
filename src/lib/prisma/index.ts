import { PrismaPg } from "@prisma/adapter-pg";
import { databaseConfig } from "@/config/databaseConfig";
import { PrismaClient } from "@/database/generated/prisma/client";

const adapter = new PrismaPg({ connectionString: databaseConfig.url });
const prisma = new PrismaClient({ adapter });

export { prisma };
