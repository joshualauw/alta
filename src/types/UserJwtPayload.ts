import { User } from "@/database/generated/prisma/client";

export type UserJwtPayload = Pick<User, "id" | "name" | "email" | "role" | "isActive">;
