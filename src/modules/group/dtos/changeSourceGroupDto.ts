import z from "zod";
import { Group } from "@/database/generated/prisma/client";

export const changeSourceGroupRequest = z.object({
    sourceId: z.number({ error: "is required" }),
    targetGroupId: z.number({ error: "is required" })
});

export type ChangeSourceGroupRequest = z.infer<typeof changeSourceGroupRequest>;

export type ChangeSourceGroupResponse = Pick<Group, "id">;
