import { Router } from "express";
import * as analyticsController from "@/modules/analytics/analyticsController";

const router = Router();

router.get("/dashboard", analyticsController.getDashboardStatistics);

export default router;
