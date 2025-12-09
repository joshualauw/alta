import { Router } from "express";
import { validate } from "@/middlewares/zodValidator";
import { changeSourceGroupRequest } from "@/modules/group/dtos/changeSourceGroupDto";
import { createGroupRequest } from "@/modules/group/dtos/createGroupDto";
import { updateGroupRequest } from "@/modules/group/dtos/updateGroupDto";
import * as groupController from "@/modules/group/groupController";

const router = Router();

router.get("/getAll", groupController.getAllGroup);
router.get("/getDetail/:id", groupController.getGroupDetail);
router.post("/create", validate(createGroupRequest), groupController.createGroup);
router.put("/update/:id", validate(updateGroupRequest), groupController.updateGroup);
router.delete("/delete/:id", groupController.deleteGroup);
router.patch("/changeSourceGroup", validate(changeSourceGroupRequest), groupController.changeSourceGroup);

export default router;
