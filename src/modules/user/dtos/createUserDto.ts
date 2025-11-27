import z from "zod";
import { User } from "@/database/generated/prisma/client";

export const createUserRequest = z.object({
    email: z.email({ error: "is invalid" }),
    password: z.string({ error: "is required" }).min(1, "cannot be empty"),
    name: z.string({ error: "is required" }).min(1, "cannot be empty"),
});

export type CreateUserRequest = z.infer<typeof createUserRequest>;

export type CreateUserResponse = Pick<User, "id" | "name" | "email" | "role" | "isActive"> & {
    createdAt: string;
};
