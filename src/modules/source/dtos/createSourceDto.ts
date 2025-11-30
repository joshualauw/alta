import z from "zod";
import { Source } from "@/database/generated/prisma/client";

export const createSourceRequest = z.object({
    name: z.string().min(1),
    content: z.string().min(1),
    metadata: z.record(z.string().min(1), z.unknown()).optional(),
    groupId: z.number().optional()
});

export type CreateSourceRequest = z.infer<typeof createSourceRequest>;

export type CreateSourceResponse = Pick<Source, "id" | "name"> & {
    createdAt: string;
};

export const createBulkSourceRequest = z.object({
    sources: z.array(createSourceRequest).min(1)
});

export type CreateBulkSourceRequest = z.infer<typeof createBulkSourceRequest>;

export interface CreateBulkSourceResponse {
    createdAt: string;
}
