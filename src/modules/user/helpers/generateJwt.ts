import jwt from "jsonwebtoken";
import config from "@/config";
import { UserJwtPayload } from "@/types/UserJwtPayload";

export async function generateJwt(payload: UserJwtPayload) {
    return jwt.sign(payload, config.jwt.secret, {
        expiresIn: config.jwt.expiresIn
    });
}
