import { Head } from '@inertiajs/react';
import { ProductGrid } from '@/components/products/product-grid';
import ShopLayout from '@/layouts/shop/shop-layout';
import type { Product } from '@/types';


interface HomeProps {
    products: Product[];
}

export default function Home({ products }: HomeProps) {
    return (
        <ShopLayout>
            <>
                <Head title="Главная" />

                <section className="container mx-auto px-4 py-12">
                    <div className="max-w-2xl space-y-4">
                        <h1 className="text-4xl font-bold">
                            Магазин автозапчастей
                        </h1>
                        <p className="text-muted-foreground">
                            Качественные запчасти для вашего автомобиля по
                            доступным ценам.
                        </p>
                    </div>
                </section>

                <ProductGrid products={products} />
            </>
        </ShopLayout>
    );
}
