import { Preset } from "@/database/generated/prisma/client";

export type GetAllPresetResponse = Pick<Preset, "id" | "name" | "code"> & {
    createdAt: string;
};
