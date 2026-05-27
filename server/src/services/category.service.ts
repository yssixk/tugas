import { supabaseAdmin } from "../lib/supa.js";
import { ApiError } from "../lib/ApiError.js";

export type DbCategory = {
  id: string;
  name: string;
  slug: string;
  created_at: string;
};

export async function listCategories() {
  const { data, error } = await supabaseAdmin.from("categories").select("*").order("name", { ascending: true });
  if (error) throw new ApiError(500, "Gagal ambil kategori", "DB_LIST_CATEGORIES");
  return (data ?? []) as DbCategory[];
}

export async function createCategory(input: { name: string; slug: string }) {
  const { data, error } = await supabaseAdmin.from("categories").insert(input).select("*").single<DbCategory>();
  if (error) throw new ApiError(500, "Gagal buat kategori", "DB_CREATE_CATEGORY");
  return data;
}

export async function updateCategory(id: string, patch: { name?: string; slug?: string }) {
  const { data, error } = await supabaseAdmin.from("categories").update(patch).eq("id", id).select("*").single();
  if (error) throw new ApiError(500, "Gagal update kategori", "DB_UPDATE_CATEGORY");
  return data as DbCategory;
}

export async function deleteCategory(id: string) {
  const { error } = await supabaseAdmin.from("categories").delete().eq("id", id);
  if (error) throw new ApiError(500, "Gagal hapus kategori", "DB_DELETE_CATEGORY");
}

