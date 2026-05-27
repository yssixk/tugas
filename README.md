## EcomLite (Modern E-Commerce Demo)

Stack:
- **Frontend**: React + Vite + Tailwind CSS (responsive + dark mode)
- **Backend**: Node.js + Express (MVC-ish structure, RESTful API)
- **Database**: **Supabase (Postgres)**
- **Auth**: **JWT** (Bearer token), role **user/admin**

> Catatan: request awal menyebut Supabase *dan* MySQL. Implementasi aplikasi ini memakai **Supabase (Postgres)** sesuai requirement “Database: Supabase”.  
> File skema **MySQL** juga disediakan untuk referensi di `database/mysql_schema.sql`.

---

## Fitur

- **Auth**
  - Login (email/username + password) + validasi
  - Registrasi + validasi + bcrypt hash
  - Login admin terpisah (`/admin/login`)
  - Middleware auth + role management
- **Produk**
  - Grid card modern + pagination
  - Detail produk
  - Search realtime + filter kategori & harga
- **Profil**
  - Lihat profil
  - Edit nama & alamat
  - Upload foto profil (Supabase Storage bucket)
  - Riwayat pesanan
- **Keranjang**
  - Tambah/kurang qty, hapus, subtotal & total otomatis
  - Checkout (buat order + order_items)
- **Admin**
  - Dashboard stats: total user / produk / transaksi
  - CRUD Produk (add/delete sederhana)
  - CRUD Kategori (add/delete)
  - List user
  - List transaksi
- **UI/UX**
  - Navbar responsive
  - Dark mode
  - Loading spinner
  - Toast notification

---

## Struktur Folder

```txt
website dummy/
  client/                 # Frontend (React + Tailwind)
  server/                 # Backend (Express + TS)
  supabase/
    migrations/           # SQL schema (Postgres)
    seed/                 # Dummy data seed (SQL)
  database/
    mysql_schema.sql      # Optional MySQL schema (referensi)
```

---

## Setup Supabase

**Panduan lengkap:** lihat [`SETUP-SUPABASE.md`](./SETUP-SUPABASE.md)

Ringkas:
1. Buka Supabase SQL Editor
2. Jalankan **`supabase/setup.sql`** (schema + seed + storage)
3. `npm run check-db` → `npm run seed` → `npm run dev`

---

## Konfigurasi Environment Variables

### Backend (`server/.env`)

Copy dari `server/.env.example` lalu isi:
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY` (**server-only**)
- `JWT_ACCESS_SECRET`

### Frontend (`client/.env`)

Copy dari `client/.env.example`:
- `VITE_API_URL=http://localhost:4000/api`

---

## Cara Menjalankan

Install dependencies (sekali saja):

```bash
npm install
```

Jalankan dev server (client + server):

```bash
npm run dev
```

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:4000` (health: `/health`)

---

## Seed Admin Account

Setelah `.env` backend terisi, buat akun admin:

```bash
cd server
npm run seed
```

Default admin:
- email: `admin@demo.local`
- password: `admin123`

---

## Endpoint Ringkas

Auth:
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/admin/login`

Produk:
- `GET /api/products?page=1&limit=12&q=...&category=...&minPrice=...&maxPrice=...`
- `GET /api/products/:id`

Kategori:
- `GET /api/categories`

Profil:
- `GET /api/me`
- `PATCH /api/me`
- `POST /api/me/avatar` (multipart `avatar`)

Keranjang:
- `GET /api/cart`
- `POST /api/cart/set-qty` body: `{ productId, qty }`

Order:
- `GET /api/orders`
- `POST /api/orders/checkout`

Admin:
- `GET /api/admin/stats`
- `GET /api/admin/users`
- `GET /api/admin/orders`

---

## Deploy

### Frontend — Vercel

- **Root Directory:** `client`
- **Env:**
  - `VITE_API_URL` = `https://BACKEND-KAMU/api`
  - `VITE_SUPABASE_URL` = `https://xfmiktwaqatxlvmkucgk.supabase.co`
  - `VITE_SUPABASE_ANON_KEY` = publishable key Supabase
- File `client/vercel.json` sudah ada (SPA routing)

### Backend — Render / Railway

Env minimal:
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY` atau `SUPABASE_PUBLISHABLE_KEY`
- `JWT_ACCESS_SECRET`
- `CLIENT_ORIGIN` = URL Vercel kamu (opsional, `.vercel.app` sudah diizinkan otomatis)

