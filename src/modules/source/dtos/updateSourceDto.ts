import z from "zod";

export const updateSourceRequest = z.object({
    name: z.string().min(1).optional()
});

export type UpdateSourceRequest = z.infer<typeof updateSourceRequest>;

export const updateSourceResponse = z.object({
    id: z.number(),
    name: z.string(),
    updatedAt: z.string()
});

export type UpdateSourceResponse = z.infer<typeof updateSourceResponse>;
