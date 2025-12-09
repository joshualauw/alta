import { UserJwtPayload } from "@/types/UserJwtPayload";

declare global {
    namespace Express {
        interface Request {
            user?: UserJwtPayload;
        }
    }
}
