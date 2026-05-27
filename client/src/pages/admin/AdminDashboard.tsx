import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { api } from "../../lib/api";
import { Spinner } from "../../components/ui/Spinner";

export function AdminDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<{ totalUsers: number; totalProducts: number; totalTransactions: number } | null>(
    null,
  );

  useEffect(() => {
    setLoading(true);
    api
      .get("/admin/stats")
      .then((res) => setStats(res.data.stats))
      .catch((e) => toast.error(e?.response?.data?.message ?? "Gagal ambil statistik"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900">
      <h1 className="text-xl font-semibold">Dashboard</h1>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Ringkasan sederhana toko.</p>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Spinner className="h-7 w-7" />
        </div>
      ) : (
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
            <p className="text-sm text-slate-600 dark:text-slate-300">Total user</p>
            <p className="mt-1 text-2xl font-semibold">{stats?.totalUsers ?? 0}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
            <p className="text-sm text-slate-600 dark:text-slate-300">Total produk</p>
            <p className="mt-1 text-2xl font-semibold">{stats?.totalProducts ?? 0}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
            <p className="text-sm text-slate-600 dark:text-slate-300">Total transaksi</p>
            <p className="mt-1 text-2xl font-semibold">{stats?.totalTransactions ?? 0}</p>
          </div>
        </div>
      )}
    </div>
  );
}

