import { Router } from "express";
import { validate } from "@/middlewares/zodValidator";
import { createSourceRequest } from "@/modules/source/dtos/createSourceDto";
import { getAllSourceQuery } from "@/modules/source/dtos/getAllSourceDto";
import { searchSourceRequest } from "@/modules/source/dtos/searchSourceDto";
import { updateSourceRequest } from "@/modules/source/dtos/updateSourceDto";
import * as sourceController from "@/modules/source/sourceController";

const router = Router();

router.get("/getAll", validate(getAllSourceQuery, "query"), sourceController.getAllSource);
router.get("/getDetail/:id", sourceController.getSourceDetail);
router.post("/create", validate(createSourceRequest), sourceController.createSource);
router.put("/update/:id", validate(updateSourceRequest), sourceController.updateSource);
router.delete("/delete/:id", sourceController.deleteSource);
router.post("/search", validate(searchSourceRequest), sourceController.searchSource);

export default router;
