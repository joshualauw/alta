import express from "express";
import { commonConfig } from "@/config/commonConfig";
import { errorHandler } from "@/middlewares/errorHandler";
import apiKeyRoute from "@/modules/apiKey/apiKeyRoute";
import userRoute from "@/modules/user/userRoute";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/user", userRoute);
app.use("/api/apiKey", apiKeyRoute);

app.use(errorHandler);

app.listen(commonConfig.port, () => {
    console.log(`Server running on http://localhost:${commonConfig.port}`);
});
