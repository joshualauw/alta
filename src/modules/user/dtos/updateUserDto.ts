import z from "zod";
import { User } from "@/database/generated/prisma/client";

export const updateUserRequest = z.object({
    email: z.email({ error: "is invalid" }).optional(),
    password: z.string({ error: "is required" }).min(1, "cannot be empty").optional(),
    name: z.string({ error: "is required" }).min(1, "cannot be empty").optional(),
    isActive: z.boolean({ error: "is required" }).optional(),
});

export type UpdateUserRequest = z.infer<typeof updateUserRequest>;

export type UpdateUserResponse = Pick<User, "id" | "name" | "email" | "role" | "isActive"> & {
    updatedAt: string;
};
