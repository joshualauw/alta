import z from "zod";

export const changeSourceGroupRequest = z.object({
    sourceId: z.number(),
    targetGroupId: z.number()
});

export type ChangeSourceGroupRequest = z.infer<typeof changeSourceGroupRequest>;

export const changeSourceGroupResponse = z.object({
    id: z.number()
});

export type ChangeSourceGroupResponse = z.infer<typeof changeSourceGroupResponse>;
