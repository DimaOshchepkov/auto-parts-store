<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\CartService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CartApiController
{
    public function __invoke(CartService $cart): JsonResponse
    {
        return response()->json([
            'count' => $cart->count(),
            'items' => $cart->itemsDto(),
        ]);
    }
}
