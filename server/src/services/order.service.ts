import { supabaseAdmin } from "../lib/supa.js";
import { ApiError } from "../lib/ApiError.js";
import { clearCart, getCart } from "./cart.service.js";

export async function listMyOrders(userId: string) {
  const { data, error } = await supabaseAdmin
    .from("orders")
    .select("*, order_items(qty,price, products(id,name,image_url))")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw new ApiError(500, "Gagal ambil riwayat pesanan", "DB_LIST_ORDERS");
  return data ?? [];
}

export async function checkout(userId: string) {
  const cart = await getCart(userId);
  if (cart.items.length === 0) throw new ApiError(400, "Keranjang kosong");

  const total_amount = cart.total;
  const { data: order, error: orderErr } = await supabaseAdmin
    .from("orders")
    .insert({ user_id: userId, total_amount, status: "paid" })
    .select("*")
    .single();
  if (orderErr) throw new ApiError(500, "Gagal checkout", "DB_CREATE_ORDER");

  const itemsPayload = cart.items.map((it) => ({
    order_id: (order as any).id,
    product_id: it.product_id,
    qty: it.qty,
    price: Number(it.product?.price ?? 0),
  }));

  const { error: itemsErr } = await supabaseAdmin.from("order_items").insert(itemsPayload);
  if (itemsErr) throw new ApiError(500, "Gagal checkout", "DB_CREATE_ORDER_ITEMS");

  await clearCart(userId);
  return order;
}

