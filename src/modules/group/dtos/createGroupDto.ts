import z from "zod";
import { Group } from "@/database/generated/prisma/client";

export const createGroupRequest = z.object({
    name: z.string().min(1),
    colorCode: z.string().min(1)
});

export type CreateGroupRequest = z.infer<typeof createGroupRequest>;

export type CreateGroupResponse = Pick<Group, "id" | "name" | "colorCode"> & {
    createdAt: string;
};
