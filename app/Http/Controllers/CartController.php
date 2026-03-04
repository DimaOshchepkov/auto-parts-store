<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Services\CartService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CartController extends Controller
{
    public function show(CartService $cart)
    {
        $c = $cart->current()->load(['items.product']);

        return Inertia::render('cart-show', [
            'cart' => $c,
        ]);
    }

    public function store(Request $request, CartService $cart)
    {
        $data = $request->validate([
            'product_id' => ['required', 'integer', 'exists:products,id'],
            'qty' => ['nullable', 'integer', 'min:1', 'max:999'],
        ]);

        $cart->addProduct($data['product_id'], $data['qty'] ?? 1);

        return back()->with('success', 'Добавлено в корзину');
    }

    public function update(Request $request, Product $product, CartService $cart)
    {
        $data = $request->validate([
            'qty' => ['required', 'integer', 'min:0', 'max:999'],
        ]);

        $cart->updateQuantity($product->id, $data['qty']);

        return back();
    }

    public function destroy(Product $product, CartService $cart)
    {
        $cart->removeProduct($product->id);

        return back();
    }
}
