<?php

use App\Http\Controllers\Api\CartSummaryController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::middleware('web')
    ->get('/cart/summary', CartSummaryController::class)
    ->name('api.cart.summary');
