import { allowedSourceMetadata } from "@/modules/source/dtos/createSourceDto";
import z from "zod";

export const uploadSourceQuery = z.object({
    preset: z.string().optional()
});

export type UploadSourceQuery = z.infer<typeof uploadSourceQuery>;

export const uploadSourceRequest = z.object({
    name: z.string().min(1),
    objectKey: z.string(),
    metadata: z.record(z.string().min(1), allowedSourceMetadata).optional(),
    groupId: z.number().optional()
});

export type UploadSourceRequest = z.infer<typeof uploadSourceRequest>;

export const uploadSourceResponse = z.object({
    id: z.number(),
    name: z.string(),
    createdAt: z.string()
});

export type UploadSourceResponse = z.infer<typeof uploadSourceResponse>;
