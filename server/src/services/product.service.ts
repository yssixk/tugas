import { supabaseAdmin } from "../lib/supa.js";
import { ApiError } from "../lib/ApiError.js";

export type DbProduct = {
  id: string;
  category_id: string | null;
  name: string;
  description: string;
  price: number;
  image_url: string | null;
  stock: number;
  created_at: string;
};

export async function listProducts(query: {
  page: number;
  limit: number;
  q?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
}) {
  const from = (query.page - 1) * query.limit;
  const to = from + query.limit - 1;

  let req = supabaseAdmin
    .from("products")
    .select("*, categories(id,name,slug)", { count: "exact" })
    .range(from, to)
    .order("created_at", { ascending: false });

  if (query.q) {
    req = req.or(`name.ilike.%${query.q}%,description.ilike.%${query.q}%`);
  }
  if (query.category) {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      query.category,
    );
    if (isUuid) {
      req = req.eq("category_id", query.category);
    } else {
      const { data: cat, error: catErr } = await supabaseAdmin
        .from("categories")
        .select("id")
        .eq("slug", query.category)
        .maybeSingle();
      if (catErr) throw new ApiError(500, "Gagal filter kategori", "DB_CATEGORY_FILTER");
      if (cat?.id) req = req.eq("category_id", cat.id);
      else req = req.eq("category_id", "00000000-0000-0000-0000-000000000000");
    }
  }
  if (typeof query.minPrice === "number") req = req.gte("price", query.minPrice);
  if (typeof query.maxPrice === "number") req = req.lte("price", query.maxPrice);

  const { data, error, count } = await req;
  if (error) throw new ApiError(500, "Gagal ambil produk", "DB_LIST_PRODUCTS");

  return {
    items: (data ?? []) as any[],
    page: query.page,
    limit: query.limit,
    total: count ?? 0,
    totalPages: Math.ceil((count ?? 0) / query.limit),
  };
}

export async function getProductById(id: string) {
  const { data, error } = await supabaseAdmin
    .from("products")
    .select("*, categories(id,name,slug)")
    .eq("id", id)
    .single();
  if (error) throw new ApiError(404, "Produk tidak ditemukan");
  return data;
}

export async function createProduct(input: Omit<DbProduct, "id" | "created_at">) {
  const { data, error } = await supabaseAdmin.from("products").insert(input).select("*").single();
  if (error) throw new ApiError(500, "Gagal tambah produk", "DB_CREATE_PRODUCT");
  return data as DbProduct;
}

export async function updateProduct(id: string, patch: Partial<Omit<DbProduct, "id" | "created_at">>) {
  const { data, error } = await supabaseAdmin.from("products").update(patch).eq("id", id).select("*").single();
  if (error) throw new ApiError(500, "Gagal update produk", "DB_UPDATE_PRODUCT");
  return data as DbProduct;
}

export async function deleteProduct(id: string) {
  const { error } = await supabaseAdmin.from("products").delete().eq("id", id);
  if (error) throw new ApiError(500, "Gagal hapus produk", "DB_DELETE_PRODUCT");
}

