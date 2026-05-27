import { Router } from "express";
import { requireAuth, requireRole } from "../middlewares/auth.js";
import {
  adminCreateProduct,
  adminDeleteProduct,
  adminUpdateProduct,
  getProduct,
  getProducts,
} from "../controllers/products.controller.js";

export const productsRouter = Router();

productsRouter.get("/", getProducts);
productsRouter.get("/:id", getProduct);

productsRouter.post("/", requireAuth, requireRole(["admin"]), adminCreateProduct);
productsRouter.patch("/:id", requireAuth, requireRole(["admin"]), adminUpdateProduct);
productsRouter.delete("/:id", requireAuth, requireRole(["admin"]), adminDeleteProduct);

