import { Router } from "express";
import { authorize } from "@/middlewares/authHandler";
import { validate } from "@/middlewares/zodValidator";
import { createUserRequest } from "@/modules/user/dtos/createUserDto";
import { loginRequest } from "@/modules/user/dtos/loginDto";
import { updateUserRequest } from "@/modules/user/dtos/updateUserDto";
import * as userController from "@/modules/user/userController";

const router = Router();

router.get("/", userController.getAllUser);
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
