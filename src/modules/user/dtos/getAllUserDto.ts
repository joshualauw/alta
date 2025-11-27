import { User } from "@/database/generated/prisma/client";

export type GetAllUserResponse = Pick<User, "id" | "email" | "name" | "isActive" | "role">;
