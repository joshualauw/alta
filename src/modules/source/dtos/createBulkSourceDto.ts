import z from "zod";
import { createSourceRequest } from "@/modules/source/dtos/createSourceDto";

export const createBulkSourceRequest = z.array(createSourceRequest).min(1);

export type CreateBulkSourceRequest = z.infer<typeof createBulkSourceRequest>;

export interface CreateBulkSourceResponse {
    createdAt: string;
}

export const createBulkSourceQuery = z.object({
    preset: z.string().optional()
});

export type CreateBulkSourceQuery = z.infer<typeof createBulkSourceQuery>;
