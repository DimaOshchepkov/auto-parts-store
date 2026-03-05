import * as React from 'react';
import { ShopFooter } from '@/layouts/shop/shop-footer';
import { ShopHeader } from '@/layouts/shop/shop-header';
import { useCartStore } from '@/store/cart-store';
import { useEffect } from 'react';

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const hydrate = useCartStore((s) => s.hydrate);
  const hydrated = useCartStore((s) => s.hydrated);

  useEffect(() => {
    if (hydrated) return;
    void hydrate();
  }, [hydrated, hydrate]);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <ShopHeader />
      <main className="w-full flex-1">{children}</main>
      <ShopFooter />
    </div>
  );
}
