import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { api } from "../lib/api";
import { Container } from "../components/ui/Container";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Spinner } from "../components/ui/Spinner";
import { formatIDR } from "../lib/format";
import { useAuth } from "../stores/auth";

type Me = {
  id: string;
  full_name: string;
  username: string;
  email: string;
  role: "user" | "admin";
  avatar_url: string | null;
  address: string | null;
};

export function ProfilePage() {
  const { user, setSession, token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [me, setMe] = useState<Me | null>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [fullName, setFullName] = useState("");
  const [address, setAddress] = useState("");

  const refresh = async () => {
    const [{ data: meRes }, { data: orderRes }] = await Promise.all([api.get("/me"), api.get("/orders")]);
    setMe(meRes.me);
    setOrders(orderRes.items ?? []);
    setFullName(meRes.me.full_name ?? "");
    setAddress(meRes.me.address ?? "");
  };

  useEffect(() => {
    setLoading(true);
    refresh().catch(() => toast.error("Gagal ambil profil")).finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      const { data } = await api.patch("/me", { full_name: fullName, address });
      setMe(data.me);
      if (token && user) setSession(token, { ...user, full_name: data.me.full_name });
      toast.success("Profil diperbarui");
    } catch (e: any) {
      toast.error(e?.response?.data?.message ?? "Gagal update profil");
    } finally {
      setSaving(false);
    }
  };

  const uploadAvatar = async (file: File) => {
    try {
      const form = new FormData();
      form.append("avatar", file);
      const { data } = await api.post("/me/avatar", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMe(data.me);
      toast.success("Foto profil diupdate");
    } catch (e: any) {
      toast.error(e?.response?.data?.message ?? "Gagal upload foto");
    }
  };

  return (
    <Container className="py-6">
      <h1 className="text-2xl font-semibold">Profil</h1>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Kelola data akun dan riwayat pesanan.</p>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Spinner className="h-7 w-7" />
        </div>
      ) : (
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 overflow-hidden rounded-2xl bg-slate-100 dark:bg-slate-800">
                {me?.avatar_url ? (
                  <img src={me.avatar_url} alt={me.full_name} className="h-full w-full object-cover" />
                ) : null}
              </div>
              <div>
                <p className="font-semibold">{me?.full_name}</p>
                <p className="text-sm text-slate-600 dark:text-slate-300">{me?.email}</p>
              </div>
            </div>

            <div className="mt-4">
              <label className="mb-1 block text-sm font-medium">Upload foto profil</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) uploadAvatar(f);
                }}
              />
              <p className="mt-1 text-xs text-slate-500">Maks 2MB.</p>
            </div>
          </div>

          <div className="md:col-span-2 rounded-2xl border border-slate-200 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-lg font-semibold">Edit profil</h2>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="mb-1 block text-sm font-medium">Nama lengkap</label>
                <Input value={fullName} onChange={(e) => setFullName(e.target.value)} />
              </div>
              <div className="md:col-span-2">
                <label className="mb-1 block text-sm font-medium">Alamat</label>
                <Input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Alamat pengiriman" />
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <Button onClick={save} disabled={saving}>
                {saving ? <Spinner /> : null}
                Simpan
              </Button>
            </div>
          </div>

          <div className="md:col-span-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-lg font-semibold">Riwayat pesanan</h2>
            <div className="mt-3 space-y-3">
              {orders.length === 0 ? (
                <p className="text-sm text-slate-600 dark:text-slate-300">Belum ada pesanan.</p>
              ) : (
                orders.map((o) => (
                  <div key={o.id} className="rounded-xl border border-slate-200 p-4 dark:border-slate-800">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="text-sm font-semibold">Order #{String(o.id).slice(0, 8)}</p>
                      <p className="text-sm text-emerald-700 dark:text-emerald-300">
                        {formatIDR(Number(o.total_amount))}
                      </p>
                    </div>
                    <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">Status: {o.status}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </Container>
  );
}

