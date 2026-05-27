import { Router } from "express";
import { adminLogin, login, register } from "../controllers/auth.controller.js";

export const authRouter = Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/admin/login", adminLogin);

