import z from "zod";

export const deletePresetResponse = z.object({
    id: z.number()
});

export type DeletePresetResponse = z.infer<typeof deletePresetResponse>;
