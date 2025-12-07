import config from "@/config";
import rateLimit from "express-rate-limit";

const apiLimiter = rateLimit({
    windowMs: config.RATE_LIMIT_WINDOW,
    limit: config.RATE_LIMIT_MAX_REC,
    message: "Too many requests from this IP, please try again after 15 minutes",
    standardHeaders: true,
    legacyHeaders: false
});

export default apiLimiter;
