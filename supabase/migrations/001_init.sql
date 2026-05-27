-- Supabase (Postgres) schema for e-commerce demo
-- Jalankan ini di Supabase SQL Editor, atau pakai Supabase CLI migrations.

create extension if not exists "uuid-ossp";

-- USERS
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

-- CATEGORIES
create table if not exists public.categories (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text not null unique,
  created_at timestamptz not null default now()
);

-- PRODUCTS
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

-- CART
create table if not exists public.cart_items (
  user_id uuid not null references public.users(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  qty int not null check (qty >= 0),
  created_at timestamptz not null default now(),
  primary key (user_id, product_id)
);

-- ORDERS / TRANSACTIONS
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

