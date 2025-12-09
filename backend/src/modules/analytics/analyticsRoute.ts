import { Router } from "express";
import { validate } from "@/middlewares/zodValidator";
import { getAllSearchLogQuery } from "@/modules/analytics/dtos/getAllSearchLogDto";
import * as analyticsController from "@/modules/analytics/analyticsController";

const router = Router();

router.get("/searchLog/getAll", validate(getAllSearchLogQuery, "query"), analyticsController.getAllSearchLog);

export default router;
