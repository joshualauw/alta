import { Router } from "express";
import { authorize } from "@/middlewares/authHandler";
import { validate } from "@/middlewares/zodValidator";
import { createUserRequest } from "@/modules/user/dtos/createUserDto";
import { loginRequest } from "@/modules/user/dtos/loginDto";
import { updateUserRequest } from "@/modules/user/dtos/updateUserDto";
import * as userController from "@/modules/user/userController";

const router = Router();

router.get("/getAll", userController.getAllUser);
router.post("/create", authorize(), validate(createUserRequest), userController.createUser);
router.put("/update", authorize(), validate(updateUserRequest), userController.updateUser);
router.post("/login", validate(loginRequest), userController.login);
router.delete("/delete/:id", authorize(), userController.deleteUser);

export default router;
