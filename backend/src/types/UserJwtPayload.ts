import { UserRole } from "@/database/generated/prisma/enums";

export interface UserJwtPayload {
    id: number;
    name: string;
    email: string;
    role: UserRole;
}
