import { Source } from "@/database/generated/prisma/client";

export type DeleteSourceResponse = Pick<Source, "id">;
