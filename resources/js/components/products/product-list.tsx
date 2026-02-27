import type { Product } from '@/types';
import { ProductCard } from '@/components/products/product-cart';

interface ProductListProps {
    products?: Product[];
}

export function ProductList({ products }: ProductListProps) {
    if (!products || products.length === 0) {
        return <p className="text-center text-muted">Нет продуктов</p>;
    }

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
                <ProductCard key={product.id} product={product} />
            ))}
        </div>
    );
}
