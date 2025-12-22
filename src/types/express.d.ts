import { UserJwtPayload } from "@/types/UserJwtPayload";

declare module "express" {
    export interface Request {
        user?: UserJwtPayload;
    }
}
