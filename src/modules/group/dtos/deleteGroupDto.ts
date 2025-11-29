import { Group } from "@/database/generated/prisma/client";

export type DeleteGroupResponse = Pick<Group, "id">;
