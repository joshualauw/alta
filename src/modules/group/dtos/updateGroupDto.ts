import z from "zod";
import { Group } from "@/database/generated/prisma/client";

export const updateGroupRequest = z.object({
    name: z.string().min(1).optional(),
    colorCode: z.string().min(1).optional()
});

export type UpdateGroupRequest = z.infer<typeof updateGroupRequest>;

export type UpdateGroupResponse = Pick<Group, "id" | "name" | "colorCode"> & {
    updatedAt: string;
};
