import { Router } from "express";
import { authorize } from "@/middlewares/authHandler";
import { validate } from "@/middlewares/zodValidator";
import { changeSourceGroupRequest } from "@/modules/group/dtos/changeSourceGroupDto";
import { createGroupRequest } from "@/modules/group/dtos/createGroupDto";
import { updateGroupRequest } from "@/modules/group/dtos/updateGroupDto";
import * as groupController from "@/modules/group/groupController";

const router = Router();

router.get("/getAll", authorize, groupController.getAllGroup);
router.post("/create", authorize, validate(createGroupRequest), groupController.createGroup);
router.put("/update/:id", authorize, validate(updateGroupRequest), groupController.updateGroup);
router.delete("/delete/:id", authorize, groupController.deleteGroup);
router.patch("/changeSourceGroup", authorize, validate(changeSourceGroupRequest), groupController.changeSourceGroup);

export default router;
