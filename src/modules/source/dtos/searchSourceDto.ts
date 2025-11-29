import z from "zod";

const Eq = z.object({ $eq: z.union([z.boolean(), z.string(), z.number()]) }).strict();
const Ne = z.object({ $ne: z.union([z.boolean(), z.string(), z.number()]) }).strict();
const In = z.object({ $ne: z.array(z.union([z.string(), z.number()])) }).strict();
const Nin = z.object({ $ne: z.array(z.union([z.string(), z.number()])) }).strict();
const Gt = z.object({ $gt: z.number() }).strict();
const Gte = z.object({ $gte: z.number() }).strict();
const Lt = z.object({ $lt: z.number() }).strict();
const Lte = z.object({ $lte: z.number() }).strict();

const FilterOperatorSchema = z.union([Eq, Ne, In, Nin, Gt, Gte, Lt, Lte]);

export const searchSourceRequest = z.object({
    question: z.string(),
    rerank: z.boolean().optional().default(false),
    filters: z.record(z.string(), FilterOperatorSchema).optional()
});

export type SearchSourceRequest = z.infer<typeof searchSourceRequest>;

export interface SearchSourceResponse {
    answer: string;
    references: string[];
}
