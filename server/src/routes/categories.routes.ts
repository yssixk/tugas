import { Router } from "express";
import {
  adminCreateCategory,
  adminDeleteCategory,
  adminUpdateCategory,
  getCategories,
} from "../controllers/categories.controller.js";
import { requireAuth, requireRole } from "../middlewares/auth.js";

export const categoriesRouter = Router();

categoriesRouter.get("/", getCategories);

categoriesRouter.post("/", requireAuth, requireRole(["admin"]), adminCreateCategory);
categoriesRouter.patch("/:id", requireAuth, requireRole(["admin"]), adminUpdateCategory);
categoriesRouter.delete("/:id", requireAuth, requireRole(["admin"]), adminDeleteCategory);

