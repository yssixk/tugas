import { z } from "zod";
import { asyncHandler } from "../lib/asyncHandler.js";
import {
  createProduct,
  deleteProduct,
  getProductById,
  listProducts,
  updateProduct,
} from "../services/product.service.js";

const listSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(48).default(12),
  q: z.string().optional(),
  category: z.string().optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
});

const productSchema = z.object({
  category_id: z.string().uuid().nullable().optional(),
  name: z.string().min(2),
  description: z.string().min(10),
  price: z.number().nonnegative(),
  image_url: z.string().url().nullable().optional(),
  stock: z.number().int().nonnegative().default(0),
});

export const getProducts = asyncHandler(async (req, res) => {
  const q = listSchema.parse(req.query);
  const result = await listProducts(q);
  res.json(result);
});

export const getProduct = asyncHandler(async (req, res) => {
  const id = z.string().uuid().parse(req.params.id);
  const item = await getProductById(id);
  res.json({ item });
});

export const adminCreateProduct = asyncHandler(async (req, res) => {
  const body = productSchema.parse(req.body);
  const item = await createProduct({
    category_id: body.category_id ?? null,
    name: body.name,
    description: body.description,
    price: body.price,
    image_url: body.image_url ?? null,
    stock: body.stock ?? 0,
  });
  res.status(201).json({ item });
});

export const adminUpdateProduct = asyncHandler(async (req, res) => {
  const body = productSchema.partial().parse(req.body);
  const id = z.string().uuid().parse(req.params.id);
  const item = await updateProduct(id, body as any);
  res.json({ item });
});

export const adminDeleteProduct = asyncHandler(async (req, res) => {
  const id = z.string().uuid().parse(req.params.id);
  await deleteProduct(id);
  res.json({ ok: true });
});

