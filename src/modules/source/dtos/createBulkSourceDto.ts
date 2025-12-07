import z from "zod";
import { createSourceRequest } from "@/modules/source/dtos/createSourceDto";

export const createBulkSourceRequest = z.array(createSourceRequest).min(1).max(100);

export type CreateBulkSourceRequest = z.infer<typeof createBulkSourceRequest>;

export const createBulkSourceQuery = z.object({
    preset: z.string().optional()
});

export type CreateBulkSourceQuery = z.infer<typeof createBulkSourceQuery>;

export const createBulkSourceResponse = z.object({
    createdAt: z.string()
});

export type CreateBulkSourceResponse = z.infer<typeof createBulkSourceResponse>;
