<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\CartService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CartSummaryController
{
    public function __invoke(CartService $cart): JsonResponse
    {
        return response()->json([
            'count' => $cart->count(),
        ]);
    }
}
