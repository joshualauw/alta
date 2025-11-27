import z from "zod";
import { ApiKey } from "@/database/generated/prisma/client";
import { ApiKeyScopes } from "@/types/ApiKeyScopes";

export const updateApikeyRequest = z.object({
    name: z.string({ error: "is required" }).min(1, "must not be empty").optional(),
    scopes: z
        .array(z.enum(ApiKeyScopes, { error: `scopes must be in (${ApiKeyScopes.join(", ")})` }), {
            error: "is required",
        })
        .min(1, "must not be empty")
        .optional(),
});

export type UpdateApiKeyRequest = z.infer<typeof updateApikeyRequest>;

export type UpdateApiKeyResponse = Pick<ApiKey, "id" | "name" | "isActive" | "scopes"> & {
    updatedAt: string;
};
