import { Link, NavLink, useNavigate } from "react-router-dom";
import { ShoppingCart, Store, User, Moon, Sun, Shield } from "lucide-react";
import { Container } from "./ui/Container";
import { Button } from "./ui/Button";
import { useAuth } from "../stores/auth";
import { useUi } from "../stores/ui";

export function Navbar() {
  const navigate = useNavigate();
  const { user, clear } = useAuth();
  const { darkMode, toggleDarkMode } = useUi();

  return (
    <div className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-950/70">
      <Container className="flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-semibold">
          <Store className="h-5 w-5 text-emerald-600" />
          <span>EcomLite</span>
        </Link>

        <div className="hidden items-center gap-2 md:flex">
          <NavLink
            to="/products"
            className={({ isActive }) =>
              `rounded-lg px-3 py-2 text-sm ${isActive ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300" : "hover:bg-slate-100 dark:hover:bg-slate-900"}`
            }
          >
            Produk
          </NavLink>
          <NavLink
            to="/search"
            className={({ isActive }) =>
              `rounded-lg px-3 py-2 text-sm ${isActive ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300" : "hover:bg-slate-100 dark:hover:bg-slate-900"}`
            }
          >
            Pencarian
          </NavLink>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={toggleDarkMode} aria-label="Toggle dark mode">
            {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>

          <Button variant="ghost" size="sm" onClick={() => navigate("/cart")} aria-label="Keranjang">
            <ShoppingCart className="h-4 w-4" />
          </Button>

          {user ? (
            <>
              {user.role === "admin" ? (
                <Button variant="ghost" size="sm" onClick={() => navigate("/admin")} aria-label="Admin">
                  <Shield className="h-4 w-4" />
                </Button>
              ) : null}
              <Button variant="ghost" size="sm" onClick={() => navigate("/profile")} aria-label="Profil">
                <User className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  clear();
                  navigate("/login");
                }}
              >
                Logout
              </Button>
            </>
          ) : (
            <Button size="sm" onClick={() => navigate("/login")}>
              Login
            </Button>
          )}
        </div>
      </Container>
    </div>
  );
}

