-- Optional MySQL schema (jika ingin pindah dari Supabase/Postgres)
-- Catatan: Implementasi project ini memakai Supabase (Postgres).

create table users (
  id char(36) primary key,
  full_name varchar(120) not null,
  username varchar(50) not null unique,
  email varchar(120) not null unique,
  password_hash varchar(255) not null,
  role enum('user','admin') not null default 'user',
  avatar_url text null,
  address text null,
  created_at timestamp not null default current_timestamp
);

create table categories (
  id char(36) primary key,
  name varchar(120) not null,
  slug varchar(120) not null unique,
  created_at timestamp not null default current_timestamp
);

create table products (
  id char(36) primary key,
  category_id char(36) null,
  name varchar(200) not null,
  description text not null,
  price decimal(12,2) not null default 0,
  image_url text null,
  stock int not null default 0,
  created_at timestamp not null default current_timestamp,
  constraint fk_products_category foreign key (category_id) references categories(id) on delete set null
);

create table cart_items (
  user_id char(36) not null,
  product_id char(36) not null,
  qty int not null,
  created_at timestamp not null default current_timestamp,
  primary key (user_id, product_id),
  constraint fk_cart_user foreign key (user_id) references users(id) on delete cascade,
  constraint fk_cart_product foreign key (product_id) references products(id) on delete cascade
);

create table orders (
  id char(36) primary key,
  user_id char(36) not null,
  total_amount decimal(12,2) not null default 0,
  status enum('pending','paid','shipped','done','cancelled') not null default 'paid',
  created_at timestamp not null default current_timestamp,
  constraint fk_orders_user foreign key (user_id) references users(id) on delete cascade
);

create table order_items (
  id char(36) primary key,
  order_id char(36) not null,
  product_id char(36) not null,
  qty int not null,
  price decimal(12,2) not null default 0,
  constraint fk_order_items_order foreign key (order_id) references orders(id) on delete cascade,
  constraint fk_order_items_product foreign key (product_id) references products(id)
);

