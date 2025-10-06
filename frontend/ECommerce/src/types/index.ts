export type Product = {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  rating?: number;
  description?: string;
};

export type CartItem = {
  product: Product;
  quantity: number;
};

export type Order = {
  id: string;
  items: CartItem[];
  total: number;
  date: string; // ISO
  status: 'Delivered' | 'Shipped' | 'Processing' | 'Cancelled';
};