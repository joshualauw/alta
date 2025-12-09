import config from "@/config";
import pino from "pino";

const isDevelopment = config.NODE_ENV !== "production";

const logger = pino({
    level: isDevelopment ? "debug" : "info",
    transport: isDevelopment
        ? {
              target: "pino-pretty",
              options: {
                  translateTime: "SYS:HH:MM:ss.l",
                  ignore: "pid,hostname"
              }
          }
        : undefined
});

export default logger;
