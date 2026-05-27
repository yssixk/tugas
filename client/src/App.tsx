import { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { useAuth } from "./stores/auth";
import { useUi } from "./stores/ui";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import { AdminRoute } from "./routes/AdminRoute";
import { LoginPage } from "./pages/Login";
import { RegisterPage } from "./pages/Register";
import { ProductsPage } from "./pages/Products";
import { ProductDetailPage } from "./pages/ProductDetail";
import { SearchPage } from "./pages/Search";
import { ProfilePage } from "./pages/Profile";
import { CartPage } from "./pages/Cart";
import { AdminLoginPage } from "./pages/admin/AdminLogin";
import { AdminLayout } from "./pages/admin/AdminLayout";
import { AdminDashboardPage } from "./pages/admin/AdminDashboard";
import { AdminProductsPage } from "./pages/admin/AdminProducts";
import { AdminCategoriesPage } from "./pages/admin/AdminCategories";
import { AdminUsersPage } from "./pages/admin/AdminUsers";
import { AdminOrdersPage } from "./pages/admin/AdminOrders";

export default function App() {
  const { hydrateAuthHeader } = useAuth();
  const { syncDarkModeClass } = useUi();

  useEffect(() => {
    hydrateAuthHeader();
    syncDarkModeClass();
  }, [hydrateAuthHeader, syncDarkModeClass]);

  return (
    <div className="min-h-full">
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/products" replace />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/products/:id" element={<ProductDetailPage />} />
        <Route path="/search" element={<SearchPage />} />

        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <CartPage />
            </ProtectedRoute>
          }
        />

        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route index element={<AdminDashboardPage />} />
          <Route path="products" element={<AdminProductsPage />} />
          <Route path="categories" element={<AdminCategoriesPage />} />
          <Route path="users" element={<AdminUsersPage />} />
          <Route path="orders" element={<AdminOrdersPage />} />
        </Route>

        <Route path="*" element={<div className="mx-auto max-w-6xl p-6">404</div>} />
      </Routes>
    </div>
  );
}
