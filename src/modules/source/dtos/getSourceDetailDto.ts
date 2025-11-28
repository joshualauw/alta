import { Source } from "@/database/generated/prisma/client";

export type GetSourceDetailResponse = Omit<Source, "createdAt" | "updatedAt"> & {
    createdAt: string;
};
