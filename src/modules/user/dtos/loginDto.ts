import z from "zod";
import { User } from "@/database/generated/prisma/client";

export const loginRequest = z.object({
    email: z.email({ error: "is invalid" }),
    password: z.string({ error: "is required" }).min(1, "cannot be empty"),
});

export type LoginRequest = z.infer<typeof loginRequest>;

export type LoginResponse = Pick<User, "id" | "name" | "email" | "role"> & {
    token: string;
};
