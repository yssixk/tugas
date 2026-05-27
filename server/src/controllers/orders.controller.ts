import { asyncHandler } from "../lib/asyncHandler.js";
import { ApiError } from "../lib/ApiError.js";
import { checkout, listMyOrders } from "../services/order.service.js";

export const getMyOrders = asyncHandler(async (req, res) => {
  if (!req.auth) throw new ApiError(401, "Unauthorized");
  const items = await listMyOrders(req.auth.userId);
  res.json({ items });
});

export const checkoutMyCart = asyncHandler(async (req, res) => {
  if (!req.auth) throw new ApiError(401, "Unauthorized");
  const order = await checkout(req.auth.userId);
  res.status(201).json({ order });
});

