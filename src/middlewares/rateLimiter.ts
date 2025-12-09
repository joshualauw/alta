import config from "@/config";
import rateLimit from "express-rate-limit";

export default rateLimit({
    windowMs: config.RATE_LIMIT_WINDOW,
    limit: config.RATE_LIMIT_MAX_REC,
    message: "Too many requests, please try again later",
    standardHeaders: true,
    legacyHeaders: false
});
