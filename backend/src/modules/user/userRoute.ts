import { validate } from "@/middlewares/zodValidator";
import { loginRequest } from "@/modules/user/dtos/loginDto";
import * as userController from "@/modules/user/userController";
import { Router } from "express";

const router = Router();

router.post("/login", validate(loginRequest), userController.login);

export default router;
