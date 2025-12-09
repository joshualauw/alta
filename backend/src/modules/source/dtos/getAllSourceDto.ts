import z from "zod";

export const getAllSourceQuery = z.object({
    groupId: z.string().min(1).optional()
});

export type GetAllSourceQuery = z.infer<typeof getAllSourceQuery>;

export const getAllSourceResponse = z.object({
    id: z.number(),
    name: z.string(),
    fileUrl: z.string().nullable(),
    groupId: z.number().nullable(),
    groupName: z.string().nullable(),
    status: z.enum(["PENDING", "FAILED", "DONE"]),
    createdAt: z.string()
});

export type GetAllSourceResponse = z.infer<typeof getAllSourceResponse>;
