import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { api } from "../lib/api";
import { formatIDR } from "../lib/format";
import type { Category, Product } from "../types/api";
import { Container } from "../components/ui/Container";
import { Button } from "../components/ui/Button";
import { Spinner } from "../components/ui/Spinner";
import { useAuth } from "../stores/auth";

type ProductsResponse = {
  items: Array<Product & { categories?: Category | null }>;
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export function ProductsPage() {
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [data, setData] = useState<ProductsResponse | null>(null);
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState<string>("");

  const canPrev = (data?.page ?? 1) > 1;
  const canNext = (data?.page ?? 1) < (data?.totalPages ?? 1);

  const params = useMemo(() => {
    const p: any = { page, limit: 12 };
    if (category) p.category = category;
    return p;
  }, [page, category]);

  useEffect(() => {
    (async () => {
      const { data } = await api.get("/categories");
      setCategories(data.items);
    })().catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    api
      .get("/products", { params })
      .then((res) => setData(res.data))
      .catch((e) => toast.error(e?.response?.data?.message ?? "Gagal ambil produk"))
      .finally(() => setLoading(false));
  }, [params]);

  const addToCart = async (productId: string) => {
    if (!token) return toast.error("Silakan login dulu");
    try {
      await api.post("/cart/set-qty", { productId, qty: 1 });
      toast.success("Ditambahkan ke keranjang");
    } catch (e: any) {
      toast.error(e?.response?.data?.message ?? "Gagal menambah keranjang");
    }
  };

  return (
    <Container className="py-6">
      <div className="flex flex-col items-start justify-between gap-3 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-semibold">Produk</h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Pilih produk favoritmu.</p>
        </div>

        <div className="flex w-full items-center gap-2 md:w-auto">
          <select
            className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm dark:border-slate-800 dark:bg-slate-900 md:w-64"
            value={category}
            onChange={(e) => {
              setPage(1);
              setCategory(e.target.value);
            }}
          >
            <option value="">Semua kategori</option>
            {categories.map((c) => (
              <option key={c.id} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
          <Button variant="ghost" onClick={() => (window.location.href = "/search")}>
            Cari
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Spinner className="h-7 w-7" />
        </div>
      ) : (
        <>
          <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">
            {(data?.items ?? []).map((p) => (
              <div
                key={p.id}
                className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-soft dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="aspect-square overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800">
                  {p.image_url ? (
                    <img src={p.image_url} alt={p.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs text-slate-500">
                      no image
                    </div>
                  )}
                </div>
                <div className="mt-3">
                  <p className="truncate text-sm font-semibold">{p.name}</p>
                  <p className="mt-1 text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                    {formatIDR(Number(p.price))}
                  </p>
                  <p className="mt-1 max-h-9 overflow-hidden text-xs text-slate-600 dark:text-slate-300">
                    {p.description}
                  </p>
                </div>
                <div className="mt-3 flex gap-2">
                  <Link
                    to={`/products/${p.id}`}
                    className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-center text-xs font-medium hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800"
                  >
                    Detail
                  </Link>
                  <button
                    className="flex-1 rounded-xl bg-emerald-600 px-3 py-2 text-xs font-medium text-white hover:bg-emerald-700"
                    onClick={() => addToCart(p.id)}
                  >
                    + Keranjang
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex items-center justify-between">
            <Button variant="ghost" disabled={!canPrev} onClick={() => setPage((p) => Math.max(1, p - 1))}>
              Prev
            </Button>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Page {data?.page ?? 1} / {data?.totalPages ?? 1}
            </p>
            <Button variant="ghost" disabled={!canNext} onClick={() => setPage((p) => p + 1)}>
              Next
            </Button>
          </div>
        </>
      )}
    </Container>
  );
}

