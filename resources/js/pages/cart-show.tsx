import { Link, router } from '@inertiajs/react';
import React from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import ShopLayout from '@/layouts/shop/shop-layout';

import {
    update as cartItemsUpdate,
    destroy as cartItemsDestroy,
} from '@/routes/cart/items';
import { show as productShow } from '@/routes/products';
import type { Product } from '@/types';

type CartItem = {
    id: number;
    product_id: number;
    quantity: number;
    price_snapshot?: string | number | null;
    product?: Product;
};

type Cart = {
    id: number;
    items: CartItem[];
};

export default function CartShow({ cart }: { cart: Cart }) {
    // Локальные значения qty, чтобы можно было нормально вводить/кликать,
    // а на сервер отправлять с задержкой.
    const [qtyByProduct, setQtyByProduct] = React.useState<
        Record<number, number>
    >(() =>
        Object.fromEntries(cart.items.map((i) => [i.product_id, i.quantity])),
    );

    // Если корзина пришла заново с сервера (после patch/delete),
    // синхронизируем локальное состояние.
    React.useEffect(() => {
        const source = cart.items ?? [];

        setQtyByProduct(
            Object.fromEntries(source.map((i) => [i.product_id, i.quantity])),
        );
    }, [cart.items]);

    // Debounce таймеры по product_id
    const timersRef = React.useRef<Record<number, number | undefined>>({});

    const clampQty = (n: number) => {
        if (!Number.isFinite(n)) return 1;
        return Math.max(1, Math.floor(n));
    };

    const commitQtyDebounced = (productId: number, nextQty: number) => {
        // очистить предыдущий таймер для конкретного товара
        const prev = timersRef.current[productId];
        if (prev) window.clearTimeout(prev);

        timersRef.current[productId] = window.setTimeout(() => {
            router.patch(
                cartItemsUpdate({ product: productId }),
                { qty: nextQty },
                {
                    preserveScroll: true,
                    preserveState: true,
                    replace: true,
                },
            );
        }, 500);
    };

    const setQtyLocalAndSync = (productId: number, rawQty: number) => {
        const next = clampQty(rawQty);

        setQtyByProduct((prev) => ({ ...prev, [productId]: next }));
        commitQtyDebounced(productId, next);
    };

    const remove = (productId: number) => {
        // на всякий: прибить таймер обновления, чтобы после delete не прилетел patch
        const prev = timersRef.current[productId];
        if (prev) window.clearTimeout(prev);
        delete timersRef.current[productId];

        router.delete(cartItemsDestroy({ product: productId }), {
            preserveScroll: true,
            preserveState: true,
            replace: true,
        });
    };

    const subtotal = cart.items.reduce((sum, i) => {
        const price = Number(i.price_snapshot ?? i.product?.price ?? 0);
        return sum + price * i.quantity;
    }, 0);

    return (
        <ShopLayout>
            <div className="mx-auto w-full max-w-6xl px-4 py-8">
                {cart.items.length === 0 ? (
                    <Card className="mt-8">
                        <CardContent className="py-10 text-center">
                            <p className="text-lg font-medium">Корзина пуста</p>
                            <p className="mt-2 text-sm text-muted-foreground">
                                Добавьте товары из каталога.
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_340px]">
                        {/* Items list */}
                        <div className="space-y-4">
                            {cart.items.map((item) => {
                                const product = item.product;
                                const title =
                                    product?.name ??
                                    `Товар #${item.product_id}`;

                                const price = Number(product?.price ?? 0,
                                );
                                const lineTotal = price * item.quantity;

                                const qty =
                                    qtyByProduct[item.product_id] ??
                                    item.quantity;

                                return (
                                    <Card key={item.id}>
                                        <CardContent className="p-5">
                                            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                                                <div className="min-w-0">
                                                    <Link
                                                        href={
                                                            product
                                                                ? productShow(
                                                                      product.slug,
                                                                  )
                                                                : '#'
                                                        }
                                                        className="block truncate text-base font-medium hover:underline"
                                                    >
                                                        {title}
                                                    </Link>

                                                    <p className="mt-1 text-sm text-muted-foreground">
                                                        Цена: {price}
                                                    </p>
                                                </div>

                                                <div className="flex flex-wrap items-center gap-4">
                                                    {/* Quantity */}
                                                    <div className="flex items-center gap-2">
                                                        <Button
                                                            variant="outline"
                                                            size="icon"
                                                            disabled={qty <= 1}
                                                            onClick={() =>
                                                                setQtyLocalAndSync(
                                                                    item.product_id,
                                                                    qty - 1,
                                                                )
                                                            }
                                                        >
                                                            −
                                                        </Button>

                                                        <Input
                                                            className="w-20 text-center"
                                                            inputMode="numeric"
                                                            value={qty}
                                                            onChange={(e) => {
                                                                const v =
                                                                    Number(
                                                                        e.target
                                                                            .value,
                                                                    );
                                                                setQtyLocalAndSync(
                                                                    item.product_id,
                                                                    v,
                                                                );
                                                            }}
                                                            onBlur={() => {

                                                                setQtyLocalAndSync(
                                                                    item.product_id,
                                                                    qty,
                                                                );
                                                            }}
                                                        />

                                                        <Button
                                                            variant="outline"
                                                            size="icon"
                                                            onClick={() =>
                                                                setQtyLocalAndSync(
                                                                    item.product_id,
                                                                    qty + 1,
                                                                )
                                                            }
                                                        >
                                                            +
                                                        </Button>
                                                    </div>

                                                    <div className="text-right">
                                                        <div className="text-sm text-muted-foreground">
                                                            Сумма
                                                        </div>
                                                        <div className="text-base font-semibold">
                                                            {lineTotal}
                                                        </div>
                                                    </div>

                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() =>
                                                            remove(
                                                                item.product_id,
                                                            )
                                                        }
                                                        className="text-destructive hover:text-destructive"
                                                    >
                                                        Удалить
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>

                        {/* Summary */}
                        <Card className="h-fit">
                            <CardHeader>
                                <CardTitle>Итого</CardTitle>
                            </CardHeader>

                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">
                                        Товары
                                    </span>
                                    <span>
                                        {cart.items.reduce(
                                            (s, i) => s + i.quantity,
                                            0,
                                        )}{' '}
                                        шт.
                                    </span>
                                </div>

                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">
                                        Сумма
                                    </span>
                                    <span className="font-semibold">
                                        {subtotal}
                                    </span>
                                </div>

                                <Separator />

                                <Button className="w-full">
                                    Оформить заказ
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>
        </ShopLayout>
    );
}
