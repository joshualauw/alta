import { Router } from "express";
import { authorize } from "@/middlewares/authHandler";
import { validate } from "@/middlewares/zodValidator";
import * as apiKeyController from "@/modules/apiKey/apiKeyController";
import { createApikeyRequest } from "@/modules/apiKey/dtos/createApiKeyDto";
import { updateApikeyRequest } from "@/modules/apiKey/dtos/updateApiKeyDto";

const router = Router();

router.get("/getAll", authorize(false), apiKeyController.getAllApiKey);
router.post("/create", authorize(), validate(createApikeyRequest), apiKeyController.createApiKey);
router.put("/update/:id", authorize(), validate(updateApikeyRequest), apiKeyController.updateApiKey);
router.delete("/delete/:id", authorize(), apiKeyController.deleteApiKey);

export default router;
