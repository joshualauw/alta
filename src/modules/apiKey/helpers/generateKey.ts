import crypto from "crypto";

export function generateApiKey() {
    const raw = crypto.randomBytes(32).toString("hex");
    const key = `alta_live_${raw}`;
    return key;
}

export function hashApiKey(key: string) {
    return crypto.createHash("sha256").update(key).digest("hex");
}
