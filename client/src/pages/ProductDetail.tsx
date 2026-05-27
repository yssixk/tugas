import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { api } from "../lib/api";
import { formatIDR } from "../lib/format";
import type { Product } from "../types/api";
import { Container } from "../components/ui/Container";
import { Button } from "../components/ui/Button";
import { Spinner } from "../components/ui/Spinner";
import { useAuth } from "../stores/auth";

export function ProductDetailPage() {
  const { token } = useAuth();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [item, setItem] = useState<Product | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    api
      .get(`/products/${id}`)
      .then((res) => setItem(res.data.item))
      .catch((e) => toast.error(e?.response?.data?.message ?? "Produk tidak ditemukan"))
      .finally(() => setLoading(false));
  }, [id]);

  const addToCart = async () => {
    if (!token) return toast.error("Silakan login dulu");
    try {
      await api.post("/cart/set-qty", { productId: id, qty: 1 });
      toast.success("Ditambahkan ke keranjang");
    } catch (e: any) {
      toast.error(e?.response?.data?.message ?? "Gagal menambah keranjang");
    }
  };

  return (
    <Container className="py-6">
      <Link to="/products" className="text-sm text-slate-600 hover:underline dark:text-slate-300">
        ← Kembali
      </Link>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Spinner className="h-7 w-7" />
        </div>
      ) : item ? (
        <div className="mt-4 grid gap-6 md:grid-cols-2">
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
            <div className="aspect-square bg-slate-100 dark:bg-slate-800">
              {item.image_url ? (
                <img src={item.image_url} alt={item.name} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-sm text-slate-500">no image</div>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900">
            <h1 className="text-2xl font-semibold">{item.name}</h1>
            <p className="mt-2 text-xl font-semibold text-emerald-700 dark:text-emerald-300">
              {formatIDR(Number(item.price))}
            </p>
            <p className="mt-4 text-sm text-slate-700 dark:text-slate-200">{item.description}</p>

            <div className="mt-6 flex gap-2">
              <Button onClick={addToCart}>Tambah ke keranjang</Button>
              <Button variant="ghost" onClick={() => (window.location.href = "/cart")}>
                Lihat keranjang
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="py-10">Produk tidak ditemukan</div>
      )}
    </Container>
  );
}

