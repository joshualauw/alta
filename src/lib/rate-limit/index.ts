import config from "@/config";
import rateLimit from "express-rate-limit";

const apiLimiter = rateLimit({
    windowMs: config.rateLimit.window,
    limit: config.rateLimit.maxReq,
    message: "Too many requests from this IP, please try again after 15 minutes",
    standardHeaders: true,
    legacyHeaders: false
});

export default apiLimiter;
