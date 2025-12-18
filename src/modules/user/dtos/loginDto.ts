import z from "zod";

export const loginRequest = z.object({
    email: z.email().min(1),
    password: z.string().min(1)
});

export type LoginRequest = z.infer<typeof loginRequest>;

export const loginResponse = z.object({
    userId: z.number(),
    token: z.string()
});

export type LoginResponse = z.infer<typeof loginResponse>;
