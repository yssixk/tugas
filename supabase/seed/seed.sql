insert into public.categories (name, slug)
values
  ('Elektronik', 'elektronik'),
  ('Fashion', 'fashion'),
  ('Kesehatan', 'kesehatan'),
  ('Rumah Tangga', 'rumah-tangga')
on conflict do nothing;

-- Dummy products (image_url bisa diganti ke link gambar / Supabase Storage public URL)
insert into public.products (category_id, name, description, price, image_url, stock)
select c.id, p.name, p.description, p.price, p.image_url, p.stock
from (
  values
    ('elektronik', 'Earbuds Wireless', 'Earbuds TWS dengan baterai tahan lama dan suara jernih.', 299000, null, 120),
    ('elektronik', 'Powerbank 20.000mAh', 'Fast charging, aman dibawa perjalanan.', 249000, null, 80),
    ('fashion', 'Kaos Oversize', 'Bahan cotton combed, nyaman dipakai harian.', 99000, null, 200),
    ('kesehatan', 'Vitamin C', 'Suplemen harian untuk daya tahan tubuh.', 79000, null, 150),
    ('rumah-tangga', 'Lampu LED 12W', 'Terang hemat listrik untuk rumah dan kantor.', 35000, null, 300)
) as p(category_slug, name, description, price, image_url, stock)
join public.categories c on c.slug = p.category_slug
on conflict do nothing;

