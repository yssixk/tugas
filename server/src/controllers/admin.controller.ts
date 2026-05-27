import { asyncHandler } from "../lib/asyncHandler.js";
import { getAdminStats, listOrders, listUsers } from "../services/admin.service.js";

export const adminStats = asyncHandler(async (_req, res) => {
  const stats = await getAdminStats();
  res.json({ stats });
});

export const adminGetUsers = asyncHandler(async (_req, res) => {
  const items = await listUsers();
  res.json({ items });
});

export const adminGetOrders = asyncHandler(async (_req, res) => {
  const items = await listOrders();
  res.json({ items });
});

