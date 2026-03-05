import type { Product } from '@/types/product';

export type CartItem = {
  product_id: number;
  quantity: number;
  product?: Product;
  price_snapshot?: string | number | null;
};

export type Cart = {
  items: CartItem[];
};

export type CartResponse = {
  cart: Cart;
};
