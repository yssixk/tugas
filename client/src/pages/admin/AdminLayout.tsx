import { NavLink, Outlet } from "react-router-dom";
import { BarChart3, Boxes, Tags, Users, Receipt } from "lucide-react";
import { Container } from "../../components/ui/Container";

const links = [
  { to: "/admin", label: "Dashboard", icon: BarChart3, end: true },
  { to: "/admin/products", label: "Produk", icon: Boxes },
  { to: "/admin/categories", label: "Kategori", icon: Tags },
  { to: "/admin/users", label: "User", icon: Users },
  { to: "/admin/orders", label: "Transaksi", icon: Receipt },
];

export function AdminLayout() {
  return (
    <Container className="py-6">
      <div className="grid gap-6 md:grid-cols-[260px_1fr]">
        <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-4 shadow-soft dark:border-slate-800 dark:bg-slate-900">
          <p className="px-2 pb-2 text-sm font-semibold text-slate-600 dark:text-slate-300">Admin</p>
          <nav className="space-y-1">
            {links.map((l) => (
              <NavLink
                key={l.to}
                end={(l as any).end}
                to={l.to}
                className={({ isActive }) =>
                  `flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition ${
                    isActive
                      ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
                      : "hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`
                }
              >
                <l.icon className="h-4 w-4" />
                {l.label}
              </NavLink>
            ))}
          </nav>
        </aside>

        <main>
          <Outlet />
        </main>
      </div>
    </Container>
  );
}

