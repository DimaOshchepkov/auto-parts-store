<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Services\CartService;
use Illuminate\Http\Request;

class CartApiController extends Controller
{
    public function show(CartService $cart)
    {
        $c = $cart->current()->load(['items.product']);

        return response()->json([
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

        $c = $cart->current()->load(['items.product']);

        return response()->json([
            'message' => 'Добавлено в корзину',
            'cart' => $c,
        ], 201);
    }

    public function update(Request $request, Product $product, CartService $cart)
    {
        $data = $request->validate([
            'qty' => ['required', 'integer', 'min:1', 'max:999'],
        ]);

        $cart->updateQuantity($product->id, $data['qty']);

        $c = $cart->current()->load(['items.product']);

        return response()->json([
            'cart' => $c,
        ]);
    }

    public function destroy(Product $product, CartService $cart)
    {
        $cart->removeProduct($product->id);

        $c = $cart->current()->load(['items.product']);

        return response()->json([
            'cart' => $c,
        ]);
    }
}
