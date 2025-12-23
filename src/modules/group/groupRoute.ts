import { Router } from "express";
import { validate } from "@/middlewares/zodValidator";
import { createGroupRequest } from "@/modules/group/dtos/createGroupDto";
import { updateGroupRequest } from "@/modules/group/dtos/updateGroupDto";
import * as groupController from "@/modules/group/groupController";
import { pagingQuery } from "@/types/PagingQuery";

const router = Router();

router.get("/getAll", validate(pagingQuery, "query"), groupController.getAllGroup);
router.get("/getDetail/:id", groupController.getGroupDetail);
router.post("/create", validate(createGroupRequest), groupController.createGroup);
router.put("/update/:id", validate(updateGroupRequest), groupController.updateGroup);
router.delete("/delete/:id", groupController.deleteGroup);

export default router;
