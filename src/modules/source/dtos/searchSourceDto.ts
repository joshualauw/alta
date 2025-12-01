import z from "zod";

const Eq = z.object({ $eq: z.union([z.boolean(), z.string(), z.number()]) }).strict();
const Ne = z.object({ $ne: z.union([z.boolean(), z.string(), z.number()]) }).strict();
const In = z.object({ $ne: z.array(z.union([z.string(), z.number()])) }).strict();
const Nin = z.object({ $ne: z.array(z.union([z.string(), z.number()])) }).strict();
const Gt = z.object({ $gt: z.number() }).strict();
const Gte = z.object({ $gte: z.number() }).strict();
const Lt = z.object({ $lt: z.number() }).strict();
const Lte = z.object({ $lte: z.number() }).strict();

const ComparisonOperatorSchema = z.union([Eq, Ne, In, Nin, Gt, Gte, Lt, Lte]);
const FieldComparisonSchema = z.record(z.string(), ComparisonOperatorSchema);

const And = z.object({ $and: z.array(FieldComparisonSchema).min(1) }).strict();
const Or = z.object({ $or: z.array(FieldComparisonSchema).min(1) }).strict();

const FilterSchema = z.union([FieldComparisonSchema, And, Or]);

export const searchSourceRequest = z.object({
    question: z.string().min(1),
    filters: FilterSchema.optional()
});

export type SearchSourceRequest = z.infer<typeof searchSourceRequest>;

export interface SearchSourceResponse {
    answer: string;
    references: string[];
}

export const searchSourceQuery = z.object({
    rerank: z.enum(["0", "1"]).optional(),
    preset: z.string().optional(),
    tone: z.enum(["normal", "concise", "explanatory", "formal"]).optional(),
});

export type SearchSourceQuery = z.infer<typeof searchSourceQuery>;
