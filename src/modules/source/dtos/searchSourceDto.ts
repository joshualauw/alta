import z from "zod";

const filterOperators = z.object({
    $eq: z.any().optional(),
    $ne: z.any().optional(),
    $gt: z.number().optional(),
    $gte: z.number().optional(),
    $lt: z.number().optional(),
    $lte: z.number().optional(),
    $in: z.array(z.string()).optional(),
    $nin: z.array(z.string()).optional()
});

export type FilterOperators = z.infer<typeof filterOperators>;

export const filterSchema = z.record(z.string(), filterOperators);

export type FilterSchema = z.infer<typeof filterSchema>;

export const searchSourceRequest = z.object({
    question: z.string().min(1),
    filters: filterSchema.optional()
});

export type SearchSourceRequest = z.infer<typeof searchSourceRequest>;

export const searchSourceQuery = z.object({
    rerank: z.enum(["0", "1"]).optional(),
    preset: z.string().optional(),
    tone: z.enum(["normal", "concise", "explanatory", "formal"]).optional()
});

export type SearchSourceQuery = z.infer<typeof searchSourceQuery>;

export const searchSourceResponse = z.object({
    answer: z.string(),
    references: z.array(z.string())
});

export type SearchSourceResponse = z.infer<typeof searchSourceResponse>;
