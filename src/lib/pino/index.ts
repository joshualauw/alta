import config from "@/config";
import pino from "pino";
import pinoHttp from "pino-http";
import { randomUUID } from "crypto";

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

export const requestLogger = pinoHttp({
    logger,
    genReqId: (req) => req.headers["x-request-id"] || randomUUID(),
    customLogLevel: (_req, res, err) => {
        if (err) return "error";
        if (res.statusCode >= 500) return "error";
        if (res.statusCode >= 400) return "warn";
        return "info";
    },
    serializers: {
        req: (req) => ({ id: req.id, method: req.method, url: req.url }),
        res: (res) => ({ statusCode: res.statusCode }),
        err: pino.stdSerializers.err
    }
});

export default logger;
