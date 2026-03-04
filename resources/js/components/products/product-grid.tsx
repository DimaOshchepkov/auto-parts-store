import * as React from 'react';
import { ProductCard } from '@/components/products/product-card';
import type { Product } from '@/types';

interface ProductGridProps {
    products: Product[];
}

export function ProductGrid({ products }: ProductGridProps) {
    if (!products.length) {
        return (
            <div className="container mx-auto px-4 py-12 text-center text-muted-foreground">
                Товары пока отсутствуют
            </div>
        );
    }

    return (
        <section className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </section>
    );
}
