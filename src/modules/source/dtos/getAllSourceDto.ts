import z from "zod";
import { Source } from "@/database/generated/prisma/client";

export const getAllSourceQuery = z.object({
    groupId: z.string({ error: "is required" }).min(1, "must not be empty").optional()
});

export type GetAllSourceQuery = z.infer<typeof getAllSourceQuery>;

export type GetAllSourceResponse = Pick<Source, "id" | "name" | "fileUrl" | "groupId"> & {
    createdAt: string;
    groupName: string | null;
};
