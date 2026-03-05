<?php

use App\Http\Controllers\Api\CartApiController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


Route::middleware('web')
    ->prefix('cart')
    ->name('api.cart.')
    ->group(function () {
        Route::get('/', [CartApiController::class, 'show'])->name('show');
        Route::post('/items', [CartApiController::class, 'store'])->name('items.store');
        Route::patch('/items/{product}', [CartApiController::class, 'update'])->name('items.update');
        Route::delete('/items/{product}', [CartApiController::class, 'destroy'])->name('items.destroy');
    });
