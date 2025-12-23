import { RoleCode } from "@/database/generated/prisma/enums";

export interface UserJwtPayload {
    id: number;
    email: string;
    role: RoleCode;
}
