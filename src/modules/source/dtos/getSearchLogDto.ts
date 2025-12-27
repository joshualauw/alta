import { pagingQuery } from "@/types/PagingQuery";
import { PagingResponse } from "@/types/PagingResponse";
import z from "zod";

export const getSearchLogQuery = pagingQuery;

export type GetSearchLogQuery = z.infer<typeof getSearchLogQuery>;

export const getSearchLogResponse = z.object({
    id: z.number(),
    question: z.string(),
    answer: z.string()
});

export type GetSearchLogResponse = PagingResponse<z.infer<typeof getSearchLogResponse>>;
