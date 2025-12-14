import { Preset, Source } from "@/database/generated/prisma/client";

export interface UpsertTextParams {
    source: Source;
    preset: Preset;
}
