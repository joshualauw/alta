import "express";
import { UserJwtPayload } from "@/types/UserJwtPayload";

declare module "express-serve-static-core" {
    interface Request {
        user?: UserJwtPayload;
    }
}
