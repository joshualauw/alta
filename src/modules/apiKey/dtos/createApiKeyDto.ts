import z from "zod";
import { ApiKey } from "@/database/generated/prisma/client";
import { ApiKeyScopes } from "@/types/ApiKeyScopes";

export const createApikeyRequest = z.object({
    name: z.string({ error: "is required" }).min(1, "must not be empty"),
    scopes: z
        .array(z.enum(ApiKeyScopes, { error: `scopes must be in (${ApiKeyScopes.join(", ")})` }), {
            error: "is required",
        })
        .min(1, "must not be empty"),
});

export type CreateApiKeyRequest = z.infer<typeof createApikeyRequest>;

export type CreateApiKeyResponse = Pick<ApiKey, "id" | "name" | "isActive" | "scopes"> & {
    key: string;
    createdAt: string;
};
