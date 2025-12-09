import express from "express";
import config from "@/config";

import analyticsRoute from "@/modules/analytics/analyticsRoute";
import groupRoute from "@/modules/group/groupRoute";
import presetRoute from "@/modules/preset/presetRoute";
import sourceRoute from "@/modules/source/sourceRoute";
import redoc from "redoc-express";
import path from "path";

import logger from "@/lib/pino";
import authorize from "@/middlewares/authHandler";
import requestLogger from "@/middlewares/requestLogger";
import rateLimiter from "@/middlewares/rateLimiter";
import corsHandler from "@/middlewares/corsHandler";
import errorHandler from "@/middlewares/errorHandler";

const app = express();

const frontendDist = path.join(process.cwd(), "../frontend/dist");
app.use(express.static(frontendDist));

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));
app.use(corsHandler);

if (config.NODE_ENV != "development") {
    app.use(rateLimiter);
    app.use(requestLogger);
}

app.get("/openapi.yml", (req, res) => res.sendFile(path.join(process.cwd(), "openapi.yml")));
app.get("/docs", redoc({ title: "Alta API Documentation", specUrl: "openapi.yml" }));

app.use("/api/source", authorize, sourceRoute);
app.use("/api/group", authorize, groupRoute);
app.use("/api/preset", authorize, presetRoute);
app.use("/api/analytics", authorize, analyticsRoute);

// Serve frontend SPA
app.all("/*spa", (req, res) => {
    res.sendFile(path.join(frontendDist, "index.html"));
});

app.use(errorHandler);

app.listen(config.PORT, () => {
    logger.info(`Server running on http://localhost:${config.PORT}`);
});

export default app;
