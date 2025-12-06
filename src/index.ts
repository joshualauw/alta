import express from "express";
import config from "@/config";
import { authorize } from "@/middlewares/authHandler";
import { errorHandler } from "@/middlewares/errorHandler";
import analyticsRoute from "@/modules/analytics/analyticsRoute";
import groupRoute from "@/modules/group/groupRoute";
import presetRoute from "@/modules/preset/presetRoute";
import sourceRoute from "@/modules/source/sourceRoute";
import redoc from "redoc-express";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/openapi.yml", (req, res) => res.sendFile("openapi.yml", { root: "." }));
app.get("/docs", redoc({ title: "Alta API Documentation", specUrl: "openapi.yml" }));

app.use(authorize);

app.use("/api/source", sourceRoute);
app.use("/api/group", groupRoute);
app.use("/api/preset", presetRoute);
app.use("/api/analytics", analyticsRoute);

app.use(errorHandler);

app.listen(config.port, () => {
    console.log(`Server running on http://localhost:${config.port}`);
});

export default app;
