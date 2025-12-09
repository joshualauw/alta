import z from "zod";

export const deleteGroupResponse = z.object({
    id: z.number()
});

export type DeleteGroupResponse = z.infer<typeof deleteGroupResponse>;
