import z from "zod";

export const loginRequest = z.object({
    email: z.string(),
    password: z.string()
});

export type LoginRequest = z.infer<typeof loginRequest>;

export const loginResponse = z.object({
    id: z.number(),
    email: z.string(),
    role: z.enum(["ADMIN"]),
    token: z.string()
});

export type LoginResponse = z.infer<typeof loginResponse>;
