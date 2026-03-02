import { Link } from '@inertiajs/react';
import { ProductCarousel } from '@/components/products/product-carousel';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardAction,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { show as productShow } from '@/routes/products';
import type { Product } from '@/types';

interface ProductCardProps {
    product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
    const title = product.name;
    const price = Number(product.price);

    const isNew = false;
    const discountPercent = 0;

    const finalPrice =
        discountPercent > 0 ? price - (price * discountPercent) / 100 : price;

    return (
        <Card className="group relative mx-auto w-full max-w-sm overflow-hidden rounded-2xl pt-0">
            <div className="pointer-events-none absolute inset-0 z-10 bg-black/30 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

            <ProductCarousel
                images={product.images}
                href={productShow(product.slug).url}
            />

            <CardHeader className="relative z-20">
                <CardAction className="flex gap-2">
                    {isNew && <Badge>New</Badge>}
                    {discountPercent > 0 && (
                        <Badge variant="destructive">-{discountPercent}%</Badge>
                    )}
                </CardAction>

                {/* Title (clickable) */}
                <CardTitle className="text-lg">
                    <Link
                        href={productShow(product.slug)}
                        className="hover:underline"
                        prefetch
                    >
                        {title}
                    </Link>
                </CardTitle>

                <CardDescription className="line-clamp-2">
                    {product.description}
                </CardDescription>

                <div className="pt-2">
                    {discountPercent > 0 ? (
                        <div className="flex items-center gap-2">
                            <span className="text-xl font-bold">
                                ${finalPrice.toFixed(2)}
                            </span>
                            <span className="text-sm text-muted-foreground line-through">
                                ${price.toFixed(2)}
                            </span>
                        </div>
                    ) : (
                        <span className="text-xl font-bold">
                            ${price.toFixed(2)}
                        </span>
                    )}
                </div>
            </CardHeader>

            <CardFooter className="relative z-20">
                <Button className="w-full">Добавить в корзину</Button>
            </CardFooter>
        </Card>
    );
}
