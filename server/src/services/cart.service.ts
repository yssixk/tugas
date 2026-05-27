import { supabaseAdmin } from "../lib/supa.js";
import { ApiError } from "../lib/ApiError.js";

export async function getCart(userId: string) {
  const { data, error } = await supabaseAdmin
    .from("cart_items")
    .select("product_id,qty, products(id,name,price,image_url,stock)")
    .eq("user_id", userId);

  if (error) throw new ApiError(500, "Gagal ambil keranjang", "DB_GET_CART");

  const items = (data ?? []).map((row: any) => ({
    product_id: row.product_id,
    qty: row.qty,
    product: row.products,
    subtotal: Number(row.qty) * Number(row.products?.price ?? 0),
  }));
  const total = items.reduce((sum, it) => sum + it.subtotal, 0);
  return { items, total };
}

export async function setCartQty(userId: string, productId: string, qty: number) {
  if (qty <= 0) {
    const { error } = await supabaseAdmin.from("cart_items").delete().eq("user_id", userId).eq("product_id", productId);
    if (error) throw new ApiError(500, "Gagal update keranjang", "DB_CART_DELETE");
    return;
  }

  const { error } = await supabaseAdmin.from("cart_items").upsert(
    {
      user_id: userId,
      product_id: productId,
      qty,
    },
    { onConflict: "user_id,product_id" },
  );
  if (error) throw new ApiError(500, "Gagal update keranjang", "DB_CART_UPSERT");
}

export async function clearCart(userId: string) {
  const { error } = await supabaseAdmin.from("cart_items").delete().eq("user_id", userId);
  if (error) throw new ApiError(500, "Gagal kosongkan keranjang", "DB_CART_CLEAR");
}

