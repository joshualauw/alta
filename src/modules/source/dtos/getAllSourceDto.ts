import { Source } from "@/database/generated/prisma/client";

export type GetAllSourceResponse = Pick<Source, "id" | "name" | "fileUrl" | "createdAt">;
