import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { api } from "../../lib/api";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Spinner } from "../../components/ui/Spinner";
import type { Category, Product } from "../../types/api";

export function AdminProductsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [items, setItems] = useState<Product[]>([]);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("0");
  const [stock, setStock] = useState("0");
  const [categoryId, setCategoryId] = useState<string>("");
  const [imageUrl, setImageUrl] = useState("");

  const refresh = async () => {
    const [cats, prods] = await Promise.all([api.get("/categories"), api.get("/products", { params: { page: 1, limit: 24 } })]);
    setCategories(cats.data.items ?? []);
    setItems(prods.data.items ?? []);
  };

  useEffect(() => {
    setLoading(true);
    refresh().catch(() => toast.error("Gagal ambil data")).finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const create = async () => {
    setSaving(true);
    try {
      await api.post("/products", {
        category_id: categoryId || null,
        name,
        description,
        price: Number(price),
        stock: Number(stock),
        image_url: imageUrl || null,
      });
      toast.success("Produk ditambahkan");
      setName("");
      setDescription("");
      setPrice("0");
      setStock("0");
      setCategoryId("");
      setImageUrl("");
      await refresh();
    } catch (e: any) {
      toast.error(e?.response?.data?.message ?? "Gagal tambah produk");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Hapus produk ini?")) return;
    try {
      await api.delete(`/products/${id}`);
      toast.success("Produk dihapus");
      await refresh();
    } catch (e: any) {
      toast.error(e?.response?.data?.message ?? "Gagal hapus produk");
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900">
      <h1 className="text-xl font-semibold">CRUD Produk</h1>

      <div className="mt-4 grid gap-3 rounded-2xl border border-slate-200 p-4 dark:border-slate-800 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium">Nama</label>
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Kategori</label>
          <select
            className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm dark:border-slate-800 dark:bg-slate-900"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
          >
            <option value="">(tanpa kategori)</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="mb-1 block text-sm font-medium">Deskripsi</label>
          <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Minimal 10 karakter" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Harga</label>
          <Input value={price} onChange={(e) => setPrice(e.target.value)} />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Stok</label>
          <Input value={stock} onChange={(e) => setStock(e.target.value)} />
        </div>
        <div className="md:col-span-2">
          <label className="mb-1 block text-sm font-medium">Image URL (optional)</label>
          <Input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://..." />
        </div>
        <div className="md:col-span-2 flex justify-end">
          <Button onClick={create} disabled={saving || name.trim().length < 2 || description.trim().length < 10}>
            {saving ? <Spinner /> : null}
            Tambah produk
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
                <th className="px-4 py-3">Harga</th>
                <th className="px-4 py-3">Stok</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {items.map((p) => (
                <tr key={p.id} className="border-t border-slate-200 dark:border-slate-800">
                  <td className="px-4 py-3">{p.name}</td>
                  <td className="px-4 py-3">{Number(p.price)}</td>
                  <td className="px-4 py-3">{p.stock}</td>
                  <td className="px-4 py-3 text-right">
                    <Button variant="danger" size="sm" onClick={() => remove(p.id)}>
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

