import { Router } from "express";
import { authorize } from "@/middlewares/authHandler";
import { validate } from "@/middlewares/zodValidator";
import { createSourceRequest } from "@/modules/source/dtos/createSourceDto";
import { getAllSourceQuery } from "@/modules/source/dtos/getAllSourceDto";
import { searchSourceRequest } from "@/modules/source/dtos/searchSourceDto";
import { updateSourceRequest } from "@/modules/source/dtos/updateSourceDto";
import * as sourceController from "@/modules/source/sourceController";

const router = Router();

router.get("/getAll", authorize(false), validate(getAllSourceQuery, "query"), sourceController.getAllSource);
router.get("/getDetail/:id", authorize(false), sourceController.getSourceDetail);
router.post("/create", authorize(), validate(createSourceRequest), sourceController.createSource);
router.put("/update/:id", authorize(), validate(updateSourceRequest), sourceController.updateSource);
router.delete("/delete/:id", authorize(), sourceController.deleteSource);
router.post("/search", authorize(), validate(searchSourceRequest), sourceController.searchSource);

export default router;
