import z from "zod";

export const getSourceDetailResponse = z.object({
    id: z.number(),
    name: z.string(),
    content: z.string(),
    fileUrl: z.string().nullable(),
    groupId: z.number().nullable(),
    groupName: z.string().nullable(),
    status: z.enum(["PENDING", "FAILED", "DONE"]),
    statusReason: z.string().nullable(),
    createdAt: z.string(),
    updatedAt: z.string()
});

export type GetSourceDetailResponse = z.infer<typeof getSourceDetailResponse>;
