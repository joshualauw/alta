import { prisma } from "@/lib/prisma";
import { CreateApiKeyRequest, CreateApiKeyResponse } from "@/modules/apiKey/dtos/createApiKeyDto";
import { DeleteApiKeyResponse } from "@/modules/apiKey/dtos/deleteApiKeyDto";
import { GetAllApiKeyResponse } from "@/modules/apiKey/dtos/getAllApiKeyDto";
import { UpdateApiKeyRequest, UpdateApiKeyResponse } from "@/modules/apiKey/dtos/updateApiKeyDto";
import { generateApiKey, hashApiKey } from "@/modules/apiKey/helpers/generateKey";
import { pick } from "@/utils/mapper";

export async function getAllApikey(): Promise<GetAllApiKeyResponse[]> {
    const apiKeys = await prisma.apiKey.findMany();

    return apiKeys.map((a) => ({
        ...pick(a, "id", "name", "isActive", "scopes", "createdAt"),
    }));
}

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

export async function updateApiKey(id: number, payload: UpdateApiKeyRequest): Promise<UpdateApiKeyResponse> {
    const updatedApiKey = await prisma.apiKey.update({
        where: { id },
        data: payload,
    });

    return {
        ...pick(updatedApiKey, "id", "name", "isActive", "scopes"),
        updatedAt: updatedApiKey.updatedAt.toISOString(),
    };
}

export async function deleteApiKey(id: number): Promise<DeleteApiKeyResponse> {
    await prisma.apiKey.delete({
        where: { id },
    });

    return { id };
}
