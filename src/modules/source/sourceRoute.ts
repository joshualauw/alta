import { Router } from "express";
import { authorize } from "@/middlewares/authHandler";
import { validate } from "@/middlewares/zodValidator";
import { createSourceRequest } from "@/modules/source/dtos/createSourceDto";
import { updateSourceRequest } from "@/modules/source/dtos/updateSourceDto";
import * as sourceController from "@/modules/source/sourceController";

const router = Router();

router.get("/getAll", authorize(false), sourceController.getAllSource);
router.post("/create", authorize(), validate(createSourceRequest), sourceController.createSource);
router.put("/update/:id", authorize(), validate(updateSourceRequest), sourceController.updateSource);
router.delete("/delete/:id", authorize(), sourceController.deleteSource);

export default router;
