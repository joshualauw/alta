import z from "zod";
import { Group } from "@/database/generated/prisma/client";

export const updateGroupRequest = z.object({
    name: z.string({ error: "is required" }).min(1, "must not be empty").optional(),
    colorCode: z.string({ error: "is required" }).min(1, "must not be empty").optional()
});

export type UpdateGroupRequest = z.infer<typeof updateGroupRequest>;

export type UpdateGroupResponse = Pick<Group, "id" | "name" | "colorCode"> & {
    updatedAt: string;
};
