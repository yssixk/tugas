import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { api } from "../../lib/api";
import { Spinner } from "../../components/ui/Spinner";
import { formatIDR } from "../../lib/format";

export function AdminOrdersPage() {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    setLoading(true);
    api
      .get("/admin/orders")
      .then((res) => setItems(res.data.items ?? []))
      .catch((e) => toast.error(e?.response?.data?.message ?? "Gagal ambil transaksi"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900">
      <h1 className="text-xl font-semibold">Kelola Transaksi</h1>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Spinner className="h-7 w-7" />
        </div>
      ) : (
        <div className="mt-4 space-y-3">
          {items.map((o) => (
            <div key={o.id} className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-semibold">Order #{String(o.id).slice(0, 8)}</p>
                <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                  {formatIDR(Number(o.total_amount))}
                </p>
              </div>
              <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">
                User: {o.users?.full_name} ({o.users?.email})
              </p>
              <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">Status: {o.status}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

