import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { api } from "../lib/api";
import { Container } from "../components/ui/Container";
import { Button } from "../components/ui/Button";
import { Spinner } from "../components/ui/Spinner";
import { formatIDR } from "../lib/format";

type CartItem = {
  product_id: string;
  qty: number;
  subtotal: number;
  product: { id: string; name: string; price: number; image_url: string | null };
};

export function CartPage() {
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [items, setItems] = useState<CartItem[]>([]);
  const [total, setTotal] = useState(0);

  const refresh = async () => {
    const { data } = await api.get("/cart");
    setItems(data.items ?? []);
    setTotal(data.total ?? 0);
  };

  useEffect(() => {
    setLoading(true);
    refresh().catch(() => toast.error("Gagal ambil keranjang")).finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setQty = async (productId: string, qty: number) => {
    setBusy(true);
    try {
      const { data } = await api.post("/cart/set-qty", { productId, qty });
      setItems(data.items ?? []);
      setTotal(data.total ?? 0);
    } catch (e: any) {
      toast.error(e?.response?.data?.message ?? "Gagal update keranjang");
    } finally {
      setBusy(false);
    }
  };

  const checkout = async () => {
    setBusy(true);
    try {
      await api.post("/orders/checkout");
      toast.success("Checkout berhasil");
      await refresh();
    } catch (e: any) {
      toast.error(e?.response?.data?.message ?? "Checkout gagal");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Container className="py-6">
      <h1 className="text-2xl font-semibold">Keranjang</h1>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Atur jumlah barang dan checkout.</p>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Spinner className="h-7 w-7" />
        </div>
      ) : (
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2 space-y-3">
            {items.length === 0 ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
                <p className="text-sm text-slate-600 dark:text-slate-300">Keranjang kamu kosong.</p>
              </div>
            ) : (
              items.map((it) => (
                <div
                  key={it.product_id}
                  className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"
                >
                  <div className="h-20 w-20 overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800">
                    {it.product.image_url ? (
                      <img src={it.product.image_url} alt={it.product.name} className="h-full w-full object-cover" />
                    ) : null}
                  </div>
                  <div className="flex flex-1 items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold">{it.product.name}</p>
                      <p className="mt-1 text-sm text-emerald-700 dark:text-emerald-300">
                        {formatIDR(Number(it.product.price))}
                      </p>
                      <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">
                        Subtotal: {formatIDR(Number(it.subtotal))}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className="flex items-center gap-2">
                        <button
                          disabled={busy}
                          className="h-9 w-9 rounded-xl border border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800"
                          onClick={() => setQty(it.product_id, Math.max(0, it.qty - 1))}
                        >
                          -
                        </button>
                        <span className="w-8 text-center text-sm font-semibold">{it.qty}</span>
                        <button
                          disabled={busy}
                          className="h-9 w-9 rounded-xl border border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800"
                          onClick={() => setQty(it.product_id, it.qty + 1)}
                        >
                          +
                        </button>
                      </div>
                      <button
                        disabled={busy}
                        className="text-xs font-medium text-rose-600 hover:underline dark:text-rose-400"
                        onClick={() => setQty(it.product_id, 0)}
                      >
                        Hapus
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="h-fit rounded-2xl border border-slate-200 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-lg font-semibold">Ringkasan</h2>
            <div className="mt-3 flex items-center justify-between text-sm">
              <span className="text-slate-600 dark:text-slate-300">Total</span>
              <span className="font-semibold text-emerald-700 dark:text-emerald-300">{formatIDR(Number(total))}</span>
            </div>
            <Button className="mt-4 w-full" disabled={busy || items.length === 0} onClick={checkout}>
              {busy ? <Spinner /> : null}
              Checkout
            </Button>
          </div>
        </div>
      )}
    </Container>
  );
}

