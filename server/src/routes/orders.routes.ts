import { Router } from "express";
import { requireAuth } from "../middlewares/auth.js";
import { checkoutMyCart, getMyOrders } from "../controllers/orders.controller.js";

export const ordersRouter = Router();

ordersRouter.get("/", requireAuth, getMyOrders);
ordersRouter.post("/checkout", requireAuth, checkoutMyCart);

