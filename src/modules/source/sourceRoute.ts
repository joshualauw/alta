import { Router } from "express";
import { validate } from "@/middlewares/zodValidator";
import { createBulkSourceQuery, createBulkSourceRequest } from "@/modules/source/dtos/createBulkSourceDto";
import { createSourceQuery, createSourceRequest } from "@/modules/source/dtos/createSourceDto";
import { getAllSourceQuery } from "@/modules/source/dtos/getAllSourceDto";
import { searchSourceQuery, searchSourceRequest } from "@/modules/source/dtos/searchSourceDto";
import { updateSourceRequest } from "@/modules/source/dtos/updateSourceDto";
import * as sourceController from "@/modules/source/sourceController";
import { filterSourceQuery, filterSourceRequest } from "@/modules/source/dtos/filterSourceDto";
import { uploadSourceQuery, uploadSourceRequest } from "@/modules/source/dtos/uploadSourceDto";
import { getSearchLogQuery } from "@/modules/source/dtos/getSearchLogDto";

const router = Router();

router.get("/getAll", validate(getAllSourceQuery, "query"), sourceController.getAllSource);
router.get("/getDetail/:id", sourceController.getSourceDetail);
router.get("/presigned", sourceController.getSourcePresignedUrl);
router.post("/upload", validate(uploadSourceQuery, "query"), validate(uploadSourceRequest), sourceController.uploadSource);
router.post("/filter", validate(filterSourceQuery, "query"), validate(filterSourceRequest), sourceController.filterSource);
router.post("/create", validate(createSourceQuery, "query"), validate(createSourceRequest), sourceController.createSource);
router.post("/create/bulk", validate(createBulkSourceQuery, "query"), validate(createBulkSourceRequest), sourceController.createBulkSource);
router.put("/update/:id", validate(updateSourceRequest), sourceController.updateSource);
router.delete("/delete/:id", sourceController.deleteSource);
router.post("/search", validate(searchSourceQuery, "query"), validate(searchSourceRequest), sourceController.searchSource);
router.get("/search/log", validate(getSearchLogQuery, "query"), sourceController.getSearchLog);

export default router;
