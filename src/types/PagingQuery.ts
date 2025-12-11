import z from "zod";

export const pagingQuery = z.object({
    page: z.coerce.number().min(1).default(1),
    size: z.coerce.number().min(1).max(20).default(20)
});

export type PagingQuery = z.infer<typeof pagingQuery>;
