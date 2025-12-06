import z from "zod";

export const getAllPresetResponse = z.object({
    id: z.number(),
    name: z.string(),
    code: z.string(),
    createdAt: z.string()
});

export type GetAllPresetResponse = z.infer<typeof getAllPresetResponse>;
