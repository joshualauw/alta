import { Router } from "express";
import * as userController from "@/modules/user/userController";
import { validate } from "@/middlewares/zodValidator";
import { loginRequest } from "@/modules/user/dtos/loginDto";
import authorize from "@/middlewares/authHandler";

const router = Router();

router.get("/me", authorize, userController.me);
router.post("/login", validate(loginRequest), userController.login);

export default router;
