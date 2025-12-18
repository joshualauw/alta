import { Router } from "express";
import * as userController from "@/modules/user/userController";
import { validate } from "@/middlewares/zodValidator";
import { loginRequest } from "@/modules/user/dtos/loginDto";

const router = Router();

router.post("/login", validate(loginRequest), userController.login);

export default router;
