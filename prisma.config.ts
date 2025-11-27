import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "src/database/prisma/schema.prisma",
  migrations: {
    seed: "ts-node -r tsconfig-paths/register src/database/prisma/seed.ts",
    path: "src/database/prisma/migrations",
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});
