import { ApiKey } from "@/database/generated/prisma/client";

export type GetAllApiKeyResponse = Pick<ApiKey, "id" | "name" | "isActive" | "scopes" | "createdAt">;
