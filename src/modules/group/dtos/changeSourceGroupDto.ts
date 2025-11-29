import z from "zod";
import { Group } from "@/database/generated/prisma/client";

export const changeSourceGroupRequest = z.object({
    sourceId: z.number(),
    targetGroupId: z.number()
});

export type ChangeSourceGroupRequest = z.infer<typeof changeSourceGroupRequest>;

export type ChangeSourceGroupResponse = Pick<Group, "id">;
