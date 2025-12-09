import z from "zod";

export const updateGroupRequest = z.object({
    name: z.string().min(1).optional(),
    colorCode: z.string().min(1).optional()
});

export type UpdateGroupRequest = z.infer<typeof updateGroupRequest>;

export const updateGroupResponse = z.object({
    id: z.number(),
    name: z.string(),
    colorCode: z.string(),
    updatedAt: z.string()
});

export type UpdateGroupResponse = z.infer<typeof updateGroupResponse>;
