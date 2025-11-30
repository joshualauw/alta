import z from "zod";
import { createSourceRequest } from "@/modules/source/dtos/createSourceDto";

export const createBulkSourceRequest = z.object({
    sources: z.array(createSourceRequest).min(1)
});

export type CreateBulkSourceRequest = z.infer<typeof createBulkSourceRequest>;

export interface CreateBulkSourceResponse {
    createdAt: string;
}
