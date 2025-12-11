import { Router } from "express";
import { validate } from "@/middlewares/zodValidator";
import { createPresetRequest } from "@/modules/preset/dtos/createPresetDto";
import { updatePresetRequest } from "@/modules/preset/dtos/updatePresetDto";
import * as presetController from "@/modules/preset/presetController";
import { pagingQuery } from "@/types/PagingQuery";

const router = Router();

router.get("/getAll", validate(pagingQuery, "query"), presetController.getAllPreset);
router.get("/getDetail/:id", presetController.getPresetDetail);
router.post("/create", validate(createPresetRequest), presetController.createPreset);
router.put("/update/:id", validate(updatePresetRequest), presetController.updatePreset);
router.delete("/delete/:id", presetController.deletePreset);

export default router;
