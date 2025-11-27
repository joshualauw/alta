import z from "zod";
import { User } from "@/database/generated/prisma/browser";

export const loginRequest = z.object({
    email: z.email().min(1, "email is required"),
    password: z.string().min(1, "password is required"),
});

export type LoginRequest = z.infer<typeof loginRequest>;

export type LoginResponse = Pick<User, "id" | "email" | "name" | "role"> & {
    token: string;
};
