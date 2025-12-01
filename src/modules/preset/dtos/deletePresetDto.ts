import { Preset } from "@/database/generated/prisma/client";

export type DeletePresetResponse = Pick<Preset, "id">;
