import z from "zod";

export const getGroupDetailResponse = z.object({
    id: z.number(),
    name: z.string(),
    colorCode: z.string(),
    createdAt: z.string(),
    updatedAt: z.string()
});

export type GetGroupDetailResponse = z.infer<typeof getGroupDetailResponse>;
