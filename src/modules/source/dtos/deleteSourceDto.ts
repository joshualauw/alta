import z from "zod";

export const deleteSourceResponse = z.object({
    id: z.number()
});

export type DeleteSourceResponse = z.infer<typeof deleteSourceResponse>;
