export type Category = { id: string; name: string; slug: string };

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string | null;
  stock: number;
  categories?: Category | null;
};

