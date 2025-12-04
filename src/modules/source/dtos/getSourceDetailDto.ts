import { Source } from "@/database/generated/prisma/client";

export type GetSourceDetailResponse = Pick<
    Source,
    "id" | "name" | "content" | "fileUrl" | "groupId" | "status" | "statusReason"
> & {
    createdAt: string;
    updatedAt: string;
    groupName: string | null;
};
