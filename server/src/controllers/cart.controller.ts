import { z } from "zod";
import { asyncHandler } from "../lib/asyncHandler.js";
import { ApiError } from "../lib/ApiError.js";
import { getCart, setCartQty } from "../services/cart.service.js";

const setQtySchema = z.object({
  productId: z.string().uuid(),
  qty: z.coerce.number().int().min(0),
});

export const getMyCart = asyncHandler(async (req, res) => {
  if (!req.auth) throw new ApiError(401, "Unauthorized");
  const cart = await getCart(req.auth.userId);
  res.json(cart);
});

export const setMyCartQty = asyncHandler(async (req, res) => {
  if (!req.auth) throw new ApiError(401, "Unauthorized");
  const body = setQtySchema.parse(req.body);
  await setCartQty(req.auth.userId, body.productId, body.qty);
  const cart = await getCart(req.auth.userId);
  res.json(cart);
});

