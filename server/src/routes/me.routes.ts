import { Router } from "express";
import multer from "multer";
import { requireAuth } from "../middlewares/auth.js";
import { getMe, patchMe, uploadAvatar } from "../controllers/me.controller.js";

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 2 * 1024 * 1024 } });

export const meRouter = Router();

meRouter.get("/", requireAuth, getMe);
meRouter.patch("/", requireAuth, patchMe);
meRouter.post("/avatar", requireAuth, upload.single("avatar"), uploadAvatar);

