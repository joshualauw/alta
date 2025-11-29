import express from "express";
import config from "@/config";
import { errorHandler } from "@/middlewares/errorHandler";
import apiKeyRoute from "@/modules/apiKey/apiKeyRoute";
import groupRoute from "@/modules/group/groupRoute";
import sourceRoute from "@/modules/source/sourceRoute";
import userRoute from "@/modules/user/userRoute";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/user", userRoute);
app.use("/api/apiKey", apiKeyRoute);
app.use("/api/source", sourceRoute);
app.use("/api/group", groupRoute);

app.use(errorHandler);

app.listen(config.port, async () => {
    console.log(`Server running on http://localhost:${config.port}`);
});
