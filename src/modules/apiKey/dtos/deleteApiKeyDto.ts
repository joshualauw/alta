import { ApiKey } from "@/database/generated/prisma/client";

export type DeleteApiKeyResponse = Pick<ApiKey, "id">;
