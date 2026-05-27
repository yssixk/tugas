import { supabaseAdmin } from "../lib/supa.js";
import { ApiError } from "../lib/ApiError.js";

export async function getAdminStats() {
  const [users, products, orders] = await Promise.all([
    supabaseAdmin.from("users").select("id", { count: "exact", head: true }),
    supabaseAdmin.from("products").select("id", { count: "exact", head: true }),
    supabaseAdmin.from("orders").select("id", { count: "exact", head: true }),
  ]);

  if (users.error || products.error || orders.error) throw new ApiError(500, "Gagal ambil statistik", "DB_STATS");
  return {
    totalUsers: users.count ?? 0,
    totalProducts: products.count ?? 0,
    totalTransactions: orders.count ?? 0,
  };
}

export async function listUsers() {
  const { data, error } = await supabaseAdmin
    .from("users")
    .select("id,full_name,username,email,role,created_at")
    .order("created_at", { ascending: false })
    .limit(200);
  if (error) throw new ApiError(500, "Gagal ambil user", "DB_LIST_USERS");
  return data ?? [];
}

export async function listOrders() {
  const { data, error } = await supabaseAdmin
    .from("orders")
    .select("*, users(id,full_name,email), order_items(qty,price, products(id,name))")
    .order("created_at", { ascending: false })
    .limit(200);
  if (error) throw new ApiError(500, "Gagal ambil transaksi", "DB_LIST_ORDERS_ADMIN");
  return data ?? [];
}

