import { create } from 'zustand';

import { http } from '@/lib/http';
import { show } from '@/routes/api/cart';
import { destroy, update } from '@/routes/api/cart/items';
import type { CartItem, CartResponse } from '@/types';

type QtyMap = Record<number, number>;

type CartState = {
  hydrated: boolean;
  loading: boolean;

  /** серверная истина (последняя гидрация) */
  items: CartItem[];

  /** локальная модель количества (для мгновенного UI) */
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
      try {
        if (qty <= 0) {
          await http.delete(destroy({ product: productId }).url);
        } else {
          await http.patch(update({ product: productId }).url, { qty });
        }
      } catch {
        // глотаем — UI уже обновлён локально
      } finally {
        await get().hydrate();
      }
    }, 400);
  };

  const applyLocalQty = (productId: number, qty: number) => {
    const q = clamp(qty);

    set((state) => {
      const next = { ...state.qtyByProduct };
      if (q <= 0) delete next[productId];
      else next[productId] = q;
      return { qtyByProduct: next };
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
        const { data } = await http.get<CartResponse>(show().url);

        const items: CartItem[] = (data.cart.items ?? []).map((i) => ({
          product_id: i.product_id,
          quantity: clamp(i.quantity),
          product: i.product,
          price_snapshot: i.price_snapshot ?? null,
        }));
        console.log(data.cart.items);

        const qtyByProduct: QtyMap = {};
        for (const it of items) qtyByProduct[it.product_id] = it.quantity;

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
