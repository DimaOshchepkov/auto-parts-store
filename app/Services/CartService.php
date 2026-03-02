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

    private function cacheKeyCount(): string
    {
        if (Auth::check()) {
            return 'cart:count:user:' . Auth::id();
        }

        $token = $this->request->attributes->get(EnsureCartToken::COOKIE_NAME)
            ?? $this->request->cookie(EnsureCartToken::COOKIE_NAME);

        if (! $token) {
            throw new \RuntimeException(
                'Cart token is missing. Ensure EnsureCartToken middleware is applied to this route.'
            );
        }

        return 'cart:count:token:' . $token;
    }

    public function forgetCountCache(): void
    {
        Cache::forget($this->cacheKeyCount());
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

        $this->forgetCountCache();
        return $cart->load('items');
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

        return $cart->load('items');
    }

    public function removeProduct(int $productId): Cart
    {
        $cart = $this->current();

        CartItem::query()
            ->where('cart_id', $cart->id)
            ->where('product_id', $productId)
            ->delete();

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
        Cache::forget('cart:count:token:' . $token);

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

        Cache::forget('cart:count:user:' . Auth::id());
        // Удаляем токен из текущего Request
        $this->request->attributes->remove(EnsureCartToken::COOKIE_NAME);
        $this->request->cookies->remove(EnsureCartToken::COOKIE_NAME);
    }

    public function count(): int
    {
        $key = $this->cacheKeyCount();

        return Cache::remember($key, now()->addMinutes(5), function () {
            $cart = $this->current()->load('items:id,cart_id,quantity');
            return (int) $cart->items->sum('quantity');
        });
    }
}
