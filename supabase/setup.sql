-- ============================================================
-- EcomLite — jalankan SATU KALI di Supabase SQL Editor
-- Project: https://xfmiktwaqatxlvmkucgk.supabase.co
-- ============================================================

create extension if not exists "uuid-ossp";

-- TABLES (aman dijalankan ulang)
create table if not exists public.users (
  id uuid primary key default uuid_generate_v4(),
  full_name text not null,
  username text not null unique,
  email text not null unique,
  password_hash text not null,
  role text not null default 'user' check (role in ('user','admin')),
  avatar_url text,
  address text,
  created_at timestamptz not null default now()
);

create table if not exists public.categories (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text not null unique,
  created_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default uuid_generate_v4(),
  category_id uuid references public.categories(id) on delete set null,
  name text not null,
  description text not null,
  price numeric(12,2) not null default 0,
  image_url text,
  stock int not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists products_category_id_idx on public.products(category_id);
create index if not exists products_price_idx on public.products(price);

create table if not exists public.cart_items (
  user_id uuid not null references public.users(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  qty int not null check (qty >= 0),
  created_at timestamptz not null default now(),
  primary key (user_id, product_id)
);

create table if not exists public.orders (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.users(id) on delete cascade,
  total_amount numeric(12,2) not null default 0,
  status text not null default 'paid' check (status in ('pending','paid','shipped','done','cancelled')),
  created_at timestamptz not null default now()
);

create index if not exists orders_user_id_idx on public.orders(user_id);

create table if not exists public.order_items (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete restrict,
  qty int not null check (qty > 0),
  price numeric(12,2) not null default 0
);

create index if not exists order_items_order_id_idx on public.order_items(order_id);

-- DEMO: matikan RLS agar backend bisa pakai publishable key (untuk tugas/demo)
-- Untuk production, ganti dengan RLS + Secret key di server.
alter table public.users disable row level security;
alter table public.categories disable row level security;
alter table public.products disable row level security;
alter table public.cart_items disable row level security;
alter table public.orders disable row level security;
alter table public.order_items disable row level security;

grant usage on schema public to anon, authenticated, service_role;
grant all on all tables in schema public to anon, authenticated, service_role;
grant all on all sequences in schema public to anon, authenticated, service_role;

-- SEED kategori
insert into public.categories (name, slug)
values
  ('Elektronik', 'elektronik'),
  ('Fashion', 'fashion'),
  ('Kesehatan', 'kesehatan'),
  ('Rumah Tangga', 'rumah-tangga')
on conflict (slug) do nothing;

-- SEED produk dummy
insert into public.products (category_id, name, description, price, image_url, stock)
select c.id, p.name, p.description, p.price, p.image_url, p.stock
from (
  values
    ('elektronik', 'Earbuds Wireless', 'Earbuds TWS dengan baterai tahan lama dan suara jernih.', 299000, 'https://images.unsplash.com/photo-1590658268037-6bf12f032f2f?w=600', 120),
    ('elektronik', 'Powerbank 20.000mAh', 'Fast charging, aman dibawa perjalanan.', 249000, 'https://images.unsplash.com/photo-1609091839311-9f9a0a0b0b0b?w=600', 80),
    ('fashion', 'Kaos Oversize', 'Bahan cotton combed, nyaman dipakai harian.', 99000, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600', 200),
    ('kesehatan', 'Vitamin C', 'Suplemen harian untuk daya tahan tubuh.', 79000, 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600', 150),
    ('rumah-tangga', 'Lampu LED 12W', 'Terang hemat listrik untuk rumah dan kantor.', 35000, 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=600', 300)
) as p(category_slug, name, description, price, image_url, stock)
join public.categories c on c.slug = p.category_slug
where not exists (
  select 1 from public.products pr where pr.name = p.name
);

-- Storage buckets (public read) — skip jika sudah ada
insert into storage.buckets (id, name, public)
values
  ('avatars', 'avatars', true),
  ('products', 'products', true)
on conflict (id) do update set public = true;
