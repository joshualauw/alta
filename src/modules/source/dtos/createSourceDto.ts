import z from "zod";
import { Source } from "@/database/generated/prisma/client";

export const createSourceRequest = z.object({
    name: z.string({ error: "is required" }).min(1, "must not be empty"),
    content: z.string({ error: "is required" }).min(1, "must not be empty"),
    metadata: z.record(z.string({ error: "is required" }).min(1, "must not be empty"), z.unknown()).optional(),
    groupId: z.number({ error: "is required" }).optional()
});

export type CreateSourceRequest = z.infer<typeof createSourceRequest>;

export type CreateSourceResponse = Pick<Source, "id" | "name"> & {
    createdAt: string;
};
