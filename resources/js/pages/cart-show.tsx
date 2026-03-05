import { Link } from '@inertiajs/react'
import React  from 'react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import ShopLayout from '@/layouts/shop/shop-layout'

import { show as productShow } from '@/routes/products'
import { useCartStore } from '@/store/cart-store';
import type { CartItem as CartItemDto } from '@/types'

export default function CartShow() {
  const hydrated = useCartStore((s) => s.hydrated)

  const items = useCartStore((s) => s.items)
  const qtyByProduct = useCartStore((s) => s.qtyByProduct)

  const setQty = useCartStore((s) => s.setQty)
  const inc = useCartStore((s) => s.inc)
  const dec = useCartStore((s) => s.dec)
  const remove = useCartStore((s) => s.remove)


  const visibleItems = React.useMemo(() => {
    // показываем только то, что реально есть в qtyByProduct
    return items.filter((it) => (qtyByProduct[it.product_id] ?? 0) > 0)
  }, [items, qtyByProduct])


  const subtotal = React.useMemo(() => {
    return visibleItems.reduce((sum, it) => {
      const qty = qtyByProduct[it.product_id] ?? 0
      const price = Number(it.price_snapshot ?? it.product?.price ?? 0)
      return sum + price * qty
    }, 0)
  }, [visibleItems, qtyByProduct])

  const totalQty = React.useMemo(() => {
    return Object.values(qtyByProduct).reduce((a, b) => a + b, 0)
  }, [qtyByProduct])

  return (
    <ShopLayout>
      <div className="mx-auto w-full max-w-6xl px-4 py-8">
        {!hydrated ? (
          <Card className="mt-8">
            <CardContent className="py-10 text-center">
              <p className="text-sm text-muted-foreground">Загрузка корзины…</p>
            </CardContent>
          </Card>
        ) : visibleItems.length === 0 ? (
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
              {visibleItems.map((item: CartItemDto) => {
                const product = item.product
                const title = product?.name ?? `Товар #${item.product_id}`
                const price = Number(item.price_snapshot ?? product?.price ?? 0)

                const qty = qtyByProduct[item.product_id] ?? 0
                const lineTotal = price * qty

                return (
                  <Card key={item.product_id}>
                    <CardContent className="p-5">
                      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div className="min-w-0">
                          <Link
                            href={product ? productShow(product.slug) : '#'}
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
                              onClick={() => dec(item.product_id)}
                            >
                              −
                            </Button>

                            <Input
                              className="w-20 text-center"
                              inputMode="numeric"
                              value={qty}
                              onChange={(e) => {
                                const v = Number(e.target.value)
                                // clamp в сторе
                                setQty(item.product_id, v)
                              }}
                              onBlur={() => {
                                // на blur просто повторно прогоняем clamp
                                setQty(item.product_id, qty)
                              }}
                            />

                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => inc(item.product_id)}
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
                            onClick={() => remove(item.product_id)}
                            className="text-destructive hover:text-destructive"
                          >
                            Удалить
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {/* Summary */}
            <Card className="h-fit">
              <CardHeader>
                <CardTitle>Итого</CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Товары</span>
                  <span>{totalQty} шт.</span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Сумма</span>
                  <span className="font-semibold">{subtotal}</span>
                </div>

                <Separator />

                <Button className="w-full">Оформить заказ</Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </ShopLayout>
  )
}
