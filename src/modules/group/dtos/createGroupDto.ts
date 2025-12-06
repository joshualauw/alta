import z from "zod";

export const createGroupRequest = z.object({
    name: z.string().min(1),
    colorCode: z.string().min(1)
});

export type CreateGroupRequest = z.infer<typeof createGroupRequest>;

export const createGroupResponse = z.object({
    id: z.number(),
    name: z.string(),
    colorCode: z.string(),
    createdAt: z.string()
});

export type CreateGroupResponse = z.infer<typeof createGroupResponse>;
