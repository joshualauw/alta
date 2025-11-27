import { Router } from "express";
import { validate } from "@/middlewares/zodValidator";
import { loginRequest } from "@/modules/user/dtos/login.dto";
import * as userController from "@/modules/user/user.controller";

const router = Router();

router.post("/login", validate(loginRequest), userController.login);

export default router;
