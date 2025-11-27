import { User } from "@/database/generated/prisma/client";

export type DeleteUserResponse = Pick<User, "id">;
