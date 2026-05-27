import { Router } from "express";
import { requireAuth } from "../middlewares/auth.js";
import { getMyCart, setMyCartQty } from "../controllers/cart.controller.js";

export const cartRouter = Router();

cartRouter.get("/", requireAuth, getMyCart);
cartRouter.post("/set-qty", requireAuth, setMyCartQty);

