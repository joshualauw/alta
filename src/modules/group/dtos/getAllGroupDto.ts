import { Group } from "@/database/generated/prisma/client";

export type GetAllGroupResponse = Pick<Group, "id" | "colorCode" | "name" | "createdAt">;
