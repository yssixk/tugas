import { Router } from "express";
import { requireAuth, requireRole } from "../middlewares/auth.js";
import { adminGetOrders, adminGetUsers, adminStats } from "../controllers/admin.controller.js";

export const adminRouter = Router();

adminRouter.use(requireAuth, requireRole(["admin"]));

adminRouter.get("/stats", adminStats);
adminRouter.get("/users", adminGetUsers);
adminRouter.get("/orders", adminGetOrders);

