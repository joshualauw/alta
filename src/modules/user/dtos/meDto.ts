import z from "zod";

export const meResponse = z.object({
    id: z.number(),
    email: z.email(),
    role: z.enum(["ADMIN"])
});

export type MeResponse = z.infer<typeof meResponse>;
