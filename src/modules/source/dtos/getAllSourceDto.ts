import z from "zod";
import { Source } from "@/database/generated/prisma/client";

export const getAllSourceQuery = z.object({
    groupId: z.string().min(1).optional()
});

export type GetAllSourceQuery = z.infer<typeof getAllSourceQuery>;

export type GetAllSourceResponse = Pick<Source, "id" | "name" | "fileUrl" | "groupId" | "status"> & {
    createdAt: string;
    groupName: string | null;
};
