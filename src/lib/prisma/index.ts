import config from "@/config";
import { PrismaClient } from "@/database/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: config.database.url });
const prisma = new PrismaClient({ adapter });

export { prisma };
