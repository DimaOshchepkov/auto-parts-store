// resources/js/pages/shop/product-show.tsx
import * as React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import ShopLayout from '@/layouts/shop/shop-layout';


export interface Product {
    id: number;
    name: string;
    price: string;
    description: string;
}

type Props = {
    product: Product;
};

export default function ProductShow({ product }: Props) {
    return (
        <ShopLayout>
            <div className="mx-auto w-full max-w-5xl px-4 py-8">
                <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
                    {/* Левая часть: основная карточка */}

                    <Card className="overflow-hidden">
                        <CardHeader className="space-y-2">
                            <div className="flex flex-wrap items-center justify-between gap-3">
                                <CardTitle className="text-2xl">
                                    {product.name}
                                </CardTitle>
                                <Badge
                                    variant="secondary"
                                    className="text-base"
                                >
                                    {product.price}
                                </Badge>
                            </div>
                            <Separator />
                        </CardHeader>

                        <CardContent className="space-y-4">
                            <div className="group @container relative mx-auto w-full overflow-hidden rounded-xl border">
                                {/* Размытый фон */}
                                <img
                                    src="https://avatar.vercel.sh/shadcn1"
                                    alt=""
                                    aria-hidden
                                    className="absolute inset-0 h-full w-full scale-110 object-cover opacity-40 blur-3xl"
                                />

                                {/* Основная картинка */}
                                <img
                                    src="https://avatar.vercel.sh/shadcn1"
                                    alt={product.name}
                                    className="relative mx-auto h-auto w-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105 @min-[420px]:h-[420px] @min-[420px]:w-auto"
                                />
                            </div>

                            <div className="space-y-2">
                                <h3 className="text-lg font-semibold">
                                    Описание
                                </h3>
                                <p className="text-sm leading-6 whitespace-pre-line text-muted-foreground">
                                    {product.description}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Правая часть: сайдбар покупки */}
                    <Card className="h-fit">
                        <CardHeader className="space-y-1">
                            <CardTitle className="text-lg">Покупка</CardTitle>
                            <p className="text-sm text-muted-foreground">
                                Быстро добавь товар в корзину и оформи заказ.
                            </p>
                        </CardHeader>

                        <CardContent className="space-y-4">
                            <div className="rounded-xl border p-4">
                                <div className="flex items-baseline justify-between gap-3">
                                    <span className="text-sm text-muted-foreground">
                                        Цена
                                    </span>
                                    <span className="text-xl font-semibold">
                                        {product.price}
                                    </span>
                                </div>
                                <Separator className="my-3" />
                                <div className="flex items-center justify-between gap-3">
                                    <span className="text-sm text-muted-foreground">
                                        ID
                                    </span>
                                    <span className="font-mono text-sm">
                                        {product.id}
                                    </span>
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <Button className="w-full">В корзину</Button>
                                <Button variant="outline" className="w-full">
                                    В избранное
                                </Button>
                            </div>
                        </CardContent>

                        <CardFooter>
                            <p className="text-xs text-muted-foreground">
                                Оплата и доставка будут уточнены на шаге
                                оформления.
                            </p>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </ShopLayout>
    );
}
