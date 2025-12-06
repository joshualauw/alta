import z from "zod";

export const createSourceRequest = z.object({
    name: z.string().min(1),
    content: z.string().min(1),
    metadata: z.record(z.string().min(1), z.unknown()).optional(),
    groupId: z.number().optional()
});

export type CreateSourceRequest = z.infer<typeof createSourceRequest>;

export const createSourceQuery = z.object({
    preset: z.string().optional()
});

export type CreateSourceQuery = z.infer<typeof createSourceQuery>;

export const createSourceResponse = z.object({
    id: z.number(),
    name: z.string(),
    createdAt: z.string()
});

export type CreateSourceResponse = z.infer<typeof createSourceResponse>;
