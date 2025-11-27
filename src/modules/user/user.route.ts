import { Router } from "express";
import { authorize } from "@/middlewares/authHandler";
import { validate } from "@/middlewares/zodValidator";
import { createUserRequest } from "@/modules/user/dtos/create-user.dto";
import { loginRequest } from "@/modules/user/dtos/login.dto";
import { updateUserRequest } from "@/modules/user/dtos/update-user.dto";
import * as userController from "@/modules/user/user.controller";

const router = Router();

router.post("/login", validate(loginRequest), userController.login);
router.post(
    "/create-user",
    authorize(true),
    validate(createUserRequest),
    userController.createUser
);
router.put("/update-user", authorize(true), validate(updateUserRequest), userController.updateUser);
router.delete("/delete-user/:id", authorize(true), userController.deleteUser);

export default router;
