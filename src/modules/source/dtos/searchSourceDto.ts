import z from "zod";

export const searchSourceRequest = z.object({
    question: z.string({ error: "is required" }).min(1, "must not be empty"),
    sourceIds: z.array(z.number({ error: "is required" }), { error: "is required" }).min(1, "must not be empty"),
});

export type SearchSourceRequest = z.infer<typeof searchSourceRequest>;

export interface SearchSourceResponse {
    answer: string;
    references: string[];
}
