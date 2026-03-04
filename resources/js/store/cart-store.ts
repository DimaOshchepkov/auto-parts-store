import { create } from 'zustand';

import { items as apiCartItems } from '@/routes/api/cart'; // GET /api/cart/items
import {
  update as cartItemsUpdate,
  destroy as cartItemsDestroy,
} from '@/routes/cart/items';
import type { Product } from '@/types';

export type CartItemDto = {
  product_id: number;
  qty: number;
  product?: Product;
  price_snapshot?: string | number | null;
};

type QtyMap = Record<number, number>;

type CartState = {
  hydrated: boolean;
  loading: boolean;
  items: CartItemDto[];
  qtyByProduct: QtyMap;
  hydrate: () => Promise<void>;
  setQty: (productId: number, qty: number) => void;
  inc: (productId: number) => void;
  dec: (productId: number) => void;
  remove: (productId: number) => void;
};

const clamp = (n: number) =>
  Number.isFinite(n) ? Math.max(0, Math.floor(n)) : 0;

export const useCartStore = create<CartState>((set, get) => {
  const timers: Record<number, number | undefined> = {};

  const scheduleCommit = (productId: number, qty: number) => {
    const prev = timers[productId];
    if (prev) window.clearTimeout(prev);

    timers[productId] = window.setTimeout(async () => {
      // qty = 0 -> delete
      if (qty <= 0) {
        await fetch(cartItemsDestroy({ product: productId }), {
          method: 'DELETE',
          credentials: 'include',
          headers: { 'X-Requested-With': 'XMLHttpRequest' },
        }).catch(() => {});
      } else {
        // если у тебя есть POST для добавления — можно различать 0->1 как POST
        await fetch(cartItemsUpdate({ product: productId }), {
          method: 'PATCH',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
          },
          body: JSON.stringify({ qty }),
        }).catch(() => {});
      }

      // подтягиваем истину одним GET
      await get().hydrate();
    }, 400);
  };

  const applyLocalQty = (productId: number, qty: number) => {
    const q = clamp(qty);

    set((state) => {
      const nextQtyByProduct = { ...state.qtyByProduct };
      if (q <= 0) delete nextQtyByProduct[productId];
      else nextQtyByProduct[productId] = q;

      // items оставляем как есть, qty берём из qtyByProduct
      return { qtyByProduct: nextQtyByProduct };
    });

    scheduleCommit(productId, q);
  };

  return {
    hydrated: false,
    loading: false,
    items: [],
    qtyByProduct: {},

    hydrate: async () => {
      set({ loading: true });
      try {
        const r = await fetch(apiCartItems(), { credentials: 'include' });
        if (!r.ok) throw new Error('bad response');
        const data = await r.json();

        const items: CartItemDto[] = (data.items ?? []).map((i: any) => ({
          product_id: i.product_id,
          qty: clamp(i.qty),
          product: i.product,
          price_snapshot: i.price_snapshot ?? null,
        }));

        const qtyByProduct: QtyMap = {};
        for (const it of items) qtyByProduct[it.product_id] = it.qty;

        set({ items, qtyByProduct, hydrated: true, loading: false });
      } catch {
        set({ hydrated: true, loading: false });
      }
    },

    setQty: (productId, qty) => applyLocalQty(productId, qty),
    inc: (productId) =>
      applyLocalQty(productId, (get().qtyByProduct[productId] ?? 0) + 1),
    dec: (productId) =>
      applyLocalQty(productId, (get().qtyByProduct[productId] ?? 0) - 1),
    remove: (productId) => applyLocalQty(productId, 0),
  };
});
