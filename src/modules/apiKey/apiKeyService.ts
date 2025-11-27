import { prisma } from "@/lib/prisma";
import { CreateApiKeyRequest, CreateApiKeyResponse } from "@/modules/apiKey/dtos/createApiKeyDto";
import { generateApiKey, hashApiKey } from "@/modules/apiKey/helpers/generateKey";
import { pick } from "@/utils/mapper";

export async function createApiKey(payload: CreateApiKeyRequest): Promise<CreateApiKeyResponse> {
    const plainKey = generateApiKey();
    const hashed = hashApiKey(plainKey);

    const apiKey = await prisma.apiKey.create({
        data: { name: payload.name, key: hashed, scopes: payload.scopes },
    });

    return {
        ...pick(apiKey, "id", "name", "isActive", "scopes"),
        key: plainKey,
        createdAt: apiKey.createdAt.toISOString(),
    };
}
