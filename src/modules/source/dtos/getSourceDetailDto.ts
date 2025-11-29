import { Source } from "@/database/generated/prisma/client";

export type GetSourceDetailResponse = Pick<Source, "id" | "name" | "content" | "fileUrl" | "groupId"> & {
    createdAt: string;
    groupName: string | null;
};
