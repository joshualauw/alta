import pinoHttp from "pino-http";
import { randomUUID } from "crypto";
import logger from "@/lib/pino";
import pino from "pino";

export default pinoHttp({
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
