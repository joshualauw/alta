import { PagingResponse } from "@/types/PagingResponse";
import z from "zod";
import "zod-openapi";

export const getAllGroupResponse = z.object({
    id: z.number(),
    colorCode: z.string(),
    name: z.string(),
    createdAt: z.string()
});

export type GetAllGroupResponse = PagingResponse<z.infer<typeof getAllGroupResponse>>;
