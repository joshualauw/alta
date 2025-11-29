import z from "zod";
import { Group } from "@/database/generated/prisma/client";

export const createGroupRequest = z.object({
    name: z.string({ error: "is required" }).min(1, "must not be empty"),
    colorCode: z.string({ error: "is required" }).min(1, "must not be empty")
});

export type CreateGroupRequest = z.infer<typeof createGroupRequest>;

export type CreateGroupResponse = Pick<Group, "id" | "name" | "colorCode"> & {
    createdAt: string;
};
