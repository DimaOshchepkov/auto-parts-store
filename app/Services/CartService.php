<?php

namespace App\Services;

use App\Http\Middleware\EnsureCartToken;
use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Facades\DB;

readonly class CartService
{
    public function __construct(private Request $request) {}


    public function forgetCartCache(): void
    {
        Cache::forget($this->cacheKey('count'));
        Cache::forget($this->cacheKey('items'));
        Cache::forget($this->cacheKey('summary')); // если сделаешь summary
    }

    private function forgetCacheBy(string $identity): void
    {
        Cache::forget("cart:count:$identity");
        Cache::forget("cart:items:$identity");
        Cache::forget("cart:summary:$identity");
    }

    private function identity(): string
    {
        if (Auth::check()) {
            return 'user:' . Auth::id();
        }

        $token = $this->request->attributes->get(EnsureCartToken::COOKIE_NAME)
            ?? $this->request->cookie(EnsureCartToken::COOKIE_NAME);

        if (! $token) {
            throw new \RuntimeException('Cart token is missing. Ensure EnsureCartToken middleware is applied.');
        }

        return 'token:' . $token;
    }

    private function cacheKey(string $suffix): string
    {
        return 'cart:' . $suffix . ':' . $this->identity();
    }


    public function current(): Cart
    {
        if (Auth::check()) {
            return Cart::firstOrCreate(
                ['user_id' => Auth::id()],
                ['token' => null]
            );
        }

        $token = $this->request->attributes->get(EnsureCartToken::COOKIE_NAME)
            ?? $this->request->cookie(EnsureCartToken::COOKIE_NAME);

        if (! $token) {
            throw new \RuntimeException(
                'Cart token is missing. Ensure EnsureCartToken middleware is applied to this route.'
            );
        }

        return Cart::firstOrCreate(
            ['token' => $token],
            ['user_id' => null]
        );
    }

    public function addProduct(int $productId, int $qty = 1): Cart
    {
        $qty = max(1, $qty);

        $cart = $this->current();

        /** @var Product $product */
        $product = Product::query()->findOrFail($productId);

        DB::transaction(function () use ($cart, $product, $qty) {
            $item = CartItem::query()
                ->where('cart_id', $cart->id)
                ->where('product_id', $product->id)
                ->lockForUpdate()
                ->first();

            if ($item) {
                $item->quantity += $qty;
                $item->save();
                return;
            }

            CartItem::create([
                'cart_id' => $cart->id,
                'product_id' => $product->id,
                'quantity' => $qty,
                'price_snapshot' => $product->price ?? null, // подстрой под твою колонку цены
            ]);
        });

        $this->forgetCartCache();
        return $cart->load('items.product');
    }

    public function updateQuantity(int $productId, int $qty): Cart
    {
        $cart = $this->current();

        if ($qty <= 0) {
            CartItem::query()
                ->where('cart_id', $cart->id)
                ->where('product_id', $productId)
                ->delete();

            return $cart->load('items');
        }

        CartItem::query()
            ->where('cart_id', $cart->id)
            ->where('product_id', $productId)
            ->update(['quantity' => $qty]);

        $this->forgetCartCache();

        return $cart->load('items');
    }

    public function removeProduct(int $productId): Cart
    {
        $cart = $this->current();

        CartItem::query()
            ->where('cart_id', $cart->id)
            ->where('product_id', $productId)
            ->delete();

        $this->forgetCartCache();
        return $cart->load('items');
    }

    public function mergeGuestIntoUser(): void
    {
        if (! Auth::check()) {
            return;
        }

        $token = $this->request->cookie(EnsureCartToken::COOKIE_NAME);
        if (! $token) {
            return;
        }
        // Сбросим гостевой кэш по токену (явно)
        $this->forgetCacheBy('token:' . $token);

        $guestCart = Cart::query()
            ->where('token', $token)
            ->with('items')
            ->first();

        if (! $guestCart || $guestCart->items->isEmpty()) {
            // даже если пусто — можно удалить cookie
            Cookie::queue(Cookie::forget(EnsureCartToken::COOKIE_NAME));
            return;
        }

        $userCart = Cart::firstOrCreate(
            ['user_id' => Auth::id()],
            ['token' => null]
        );

        DB::transaction(function () use ($guestCart, $userCart) {
            foreach ($guestCart->items as $guestItem) {
                $existing = CartItem::query()
                    ->where('cart_id', $userCart->id)
                    ->where('product_id', $guestItem->product_id)
                    ->lockForUpdate()
                    ->first();

                if ($existing) {
                    $existing->quantity += $guestItem->quantity;
                    $existing->save();

                    $guestItem->delete();
                    continue;
                }

                $guestItem->cart_id = $userCart->id;
                $guestItem->save();
            }

            // Гостевая корзина больше не нужна
            $guestCart->delete();
        });

        Cookie::queue(Cookie::forget(EnsureCartToken::COOKIE_NAME));

        $this->forgetCacheBy('user:' . Auth::id());
        // Удаляем токен из текущего Request
        $this->request->attributes->remove(EnsureCartToken::COOKIE_NAME);
        $this->request->cookies->remove(EnsureCartToken::COOKIE_NAME);
    }

    public function itemsDto(): array
    {
        $key = $this->cacheKey('items');

        return Cache::remember($key, now()->addMinutes(5), function () {
            $cart = $this->current()->load([
                'items:id,cart_id,product_id,quantity',
                'items.product:id,name,slug,price', // добавь нужные поля
            ]);

            return $cart->items->map(fn ($item) => [
                'product_id' => (int) $item->product_id,
                'qty' => (int) $item->quantity,
                'product' => $item->product,
            ])->values()->all();
        });
    }

    public function count(): int
    {
        $key = $this->cacheKey('count');

        return Cache::remember($key, now()->addMinutes(5), function () {
            $cart = $this->current()->load('items:id,cart_id,quantity');
            return (int) $cart->items->sum('quantity');
        });
    }
}
