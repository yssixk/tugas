# Setup Supabase (Wajib — 5 menit)

Project kamu: **https://xfmiktwaqatxlvmkucgk.supabase.co**

Kredensial publishable sudah dipasang di `client/.env` dan `server/.env`.

## Langkah 1 — Jalankan SQL (sekali saja)

1. Buka [Supabase Dashboard](https://supabase.com/dashboard) → project **xfmiktwaqatxlvmkucgk**
2. Menu **SQL Editor** → **New query**
3. Copy **seluruh isi** file `supabase/setup.sql`
4. Klik **Run**

Ini akan:
- memastikan semua tabel ada
- mematikan RLS (mode demo/tugas)
- mengisi kategori & produk dummy
- membuat bucket storage `avatars` & `products`

## Langkah 2 — Cek koneksi

```bash
npm run check-db
```

Harus muncul `categories: OK`, `products: OK`, `users: OK`.

## Langkah 3 — Buat akun admin

```bash
npm run seed
```

Admin default:
- **Email:** `admin@demo.local`
- **Password:** `admin123`

## Langkah 4 — Jalankan aplikasi

```bash
npm run dev
```

- Frontend: http://localhost:5173
- Backend: http://localhost:4000/health

---

## (Opsional) Secret key untuk production

Di Supabase → **Project Settings** → **API Keys** → copy **Secret key** (`sb_secret_...`)

Tambahkan di `server/.env`:

```env
SUPABASE_SERVICE_ROLE_KEY=sb_secret_xxxxxxxx
```

Lalu aktifkan RLS lagi (jangan pakai `disable row level security` di production).

---

## Deploy Vercel (frontend)

Environment Variables di Vercel:

| Variable | Value |
|----------|--------|
| `VITE_API_URL` | URL backend kamu + `/api` |
| `VITE_SUPABASE_URL` | `https://xfmiktwaqatxlvmkucgk.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | publishable key kamu |

**Root Directory:** `client`  
**Build:** `npm run build`  
**Output:** `dist`

Backend harus online dulu (Render/Railway) dan `CLIENT_ORIGIN` di server mengizinkan domain `.vercel.app` (sudah otomatis di kode).
