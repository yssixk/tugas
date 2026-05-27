import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { api } from "../../lib/api";
import type { Category } from "../../types/api";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Spinner } from "../../components/ui/Spinner";

export function AdminCategoriesPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [items, setItems] = useState<Category[]>([]);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");

  const refresh = async () => {
    const { data } = await api.get("/categories");
    setItems(data.items ?? []);
  };

  useEffect(() => {
    setLoading(true);
    refresh().catch(() => toast.error("Gagal ambil kategori")).finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const create = async () => {
    setSaving(true);
    try {
      await api.post("/categories", { name, slug });
      toast.success("Kategori ditambahkan");
      setName("");
      setSlug("");
      await refresh();
    } catch (e: any) {
      toast.error(e?.response?.data?.message ?? "Gagal tambah kategori");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Hapus kategori ini?")) return;
    try {
      await api.delete(`/categories/${id}`);
      toast.success("Kategori dihapus");
      await refresh();
    } catch (e: any) {
      toast.error(e?.response?.data?.message ?? "Gagal hapus kategori");
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900">
      <h1 className="text-xl font-semibold">CRUD Kategori</h1>

      <div className="mt-4 grid gap-3 rounded-2xl border border-slate-200 p-4 dark:border-slate-800 md:grid-cols-3">
        <div>
          <label className="mb-1 block text-sm font-medium">Nama</label>
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Slug</label>
          <Input value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="contoh: elektronik" />
        </div>
        <div className="flex items-end justify-end">
          <Button onClick={create} disabled={saving || name.trim().length < 2 || slug.trim().length < 2}>
            {saving ? <Spinner /> : null}
            Tambah
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Spinner className="h-7 w-7" />
        </div>
      ) : (
        <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-950/40">
              <tr>
                <th className="px-4 py-3">Nama</th>
                <th className="px-4 py-3">Slug</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {items.map((c) => (
                <tr key={c.id} className="border-t border-slate-200 dark:border-slate-800">
                  <td className="px-4 py-3">{c.name}</td>
                  <td className="px-4 py-3">{c.slug}</td>
                  <td className="px-4 py-3 text-right">
                    <Button variant="danger" size="sm" onClick={() => remove(c.id)}>
                      Hapus
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

