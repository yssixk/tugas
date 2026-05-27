import { z } from "zod";
import { asyncHandler } from "../lib/asyncHandler.js";
import { createCategory, deleteCategory, listCategories, updateCategory } from "../services/category.service.js";

const categorySchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/),
});

export const getCategories = asyncHandler(async (_req, res) => {
  const items = await listCategories();
  res.json({ items });
});

export const adminCreateCategory = asyncHandler(async (req, res) => {
  const body = categorySchema.parse(req.body);
  const item = await createCategory(body);
  res.status(201).json({ item });
});

export const adminUpdateCategory = asyncHandler(async (req, res) => {
  const body = categorySchema.partial().parse(req.body);
  const id = z.string().uuid().parse(req.params.id);
  const item = await updateCategory(id, body);
  res.json({ item });
});

export const adminDeleteCategory = asyncHandler(async (req, res) => {
  const id = z.string().uuid().parse(req.params.id);
  await deleteCategory(id);
  res.json({ ok: true });
});

