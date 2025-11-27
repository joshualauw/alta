import { Router } from "express";
import { authorize } from "@/middlewares/authHandler";
import { validate } from "@/middlewares/zodValidator";
import * as apiKeyController from "@/modules/apiKey/apiKeyController";
import { createApikeyRequest } from "@/modules/apiKey/dtos/createApiKeyDto";

const router = Router();

router.post("/create", authorize(), validate(createApikeyRequest), apiKeyController.createApiKey);

export default router;
