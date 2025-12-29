import { pagingQuery } from "@/types/PagingQuery";
import { PagingResponse } from "@/types/PagingResponse";
import z from "zod";

export const getAllSourceQuery = pagingQuery;

export type GetAllSourceQuery = z.infer<typeof getAllSourceQuery>;

export const getAllSourceResponse = z.object({
    id: z.number(),
    name: z.string(),
    fileUrl: z.string().nullable(),
    groupId: z.number().nullable(),
    groupName: z.string().nullable(),
    status: z.enum(["PENDING", "FAILED", "DONE"]),
    createdAt: z.string()
});

export type GetAllSourceResponse = PagingResponse<z.infer<typeof getAllSourceResponse>>;
