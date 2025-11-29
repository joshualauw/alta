import z from "zod";
import { Source } from "@/database/generated/prisma/client";

export const updateSourceRequest = z.object({
    name: z.string().min(1).optional()
});

export type UpdateSourceRequest = z.infer<typeof updateSourceRequest>;

export type UpdateSourceResponse = Pick<Source, "id" | "name"> & {
    updatedAt: string;
};
