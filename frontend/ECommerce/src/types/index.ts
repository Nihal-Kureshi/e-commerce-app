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
  id: number;
  items: any; // JSON from backend
  total: number;
  createdAt: string; // ISO
  userId: number;
  status?: 'Delivered' | 'Shipped' | 'Processing' | 'Cancelled';
};