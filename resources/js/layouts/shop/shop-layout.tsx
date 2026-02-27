import * as React from 'react';
import { ShopFooter } from '@/layouts/shop/shop-footer';
import { ShopHeader } from '@/layouts/shop/shop-header';

export default function ShopLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen flex-col bg-background">
            <ShopHeader />
            <main className="w-full flex-1">{children}</main>
            <ShopFooter />
        </div>
    );
}
