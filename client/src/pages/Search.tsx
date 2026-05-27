import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { api } from "../lib/api";
import { formatIDR } from "../lib/format";
import type { Category, Product } from "../types/api";
import { Container } from "../components/ui/Container";
import { Input } from "../components/ui/Input";
import { Spinner } from "../components/ui/Spinner";

export function SearchPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("");
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<Product[]>([]);

  useEffect(() => {
    api
      .get("/categories")
      .then((res) => setCategories(res.data.items))
      .catch(() => {});
  }, []);

  const params = useMemo(() => {
    const p: any = { page: 1, limit: 24 };
    if (q.trim()) p.q = q.trim();
    if (category) p.category = category;
    if (minPrice) p.minPrice = Number(minPrice);
    if (maxPrice) p.maxPrice = Number(maxPrice);
    return p;
  }, [q, category, minPrice, maxPrice]);

  useEffect(() => {
    const t = setTimeout(() => {
      setLoading(true);
      api
        .get("/products", { params })
        .then((res) => setItems(res.data.items))
        .catch((e) => toast.error(e?.response?.data?.message ?? "Gagal mencari produk"))
        .finally(() => setLoading(false));
    }, 300);
    return () => clearTimeout(t);
  }, [params]);

  return (
    <Container className="py-6">
      <h1 className="text-2xl font-semibold">Pencarian</h1>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Ketik untuk mencari produk secara realtime.</p>

      <div className="mt-4 grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 md:grid-cols-4">
        <div className="md:col-span-2">
          <label className="mb-1 block text-sm font-medium">Nama produk</label>
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Cari produk..." />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Kategori</label>
          <select
            className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm dark:border-slate-800 dark:bg-slate-900"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">Semua</option>
            {categories.map((c) => (
              <option key={c.id} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-2 md:col-span-1">
          <div>
            <label className="mb-1 block text-sm font-medium">Min</label>
            <Input value={minPrice} onChange={(e) => setMinPrice(e.target.value)} placeholder="0" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Max</label>
            <Input value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} placeholder="999999" />
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <p className="text-sm text-slate-600 dark:text-slate-300">{items.length} hasil</p>
        {loading ? <Spinner /> : null}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">
        {items.map((p) => (
          <Link
            key={p.id}
            to={`/products/${p.id}`}
            className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-soft dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="aspect-square overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800">
              {p.image_url ? (
                <img src={p.image_url} alt={p.name} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-xs text-slate-500">no image</div>
              )}
            </div>
            <p className="mt-3 truncate text-sm font-semibold">{p.name}</p>
            <p className="mt-1 text-sm font-semibold text-emerald-700 dark:text-emerald-300">
              {formatIDR(Number(p.price))}
            </p>
          </Link>
        ))}
      </div>
    </Container>
  );
}

