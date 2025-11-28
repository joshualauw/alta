import z from "zod";
import { Source } from "@/database/generated/prisma/client";

export const updateSourceRequest = z.object({
    name: z.string({ error: "is required" }).min(1, "must not be empty").optional(),
    content: z.string({ error: "is required" }).min(1, "must not be empty").optional(),
});

export type UpdateSourceRequest = z.infer<typeof updateSourceRequest>;

export type UpdateSourceResponse = Pick<Source, "id" | "name"> & {
    updatedAt: string;
};
