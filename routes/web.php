<?php

use App\Http\Controllers\Api\CartApiController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\PageController;
use App\Http\Middleware\EnsureCartToken;
use App\Models\Product;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;
use App\Http\Controllers\CartController;

use App\Http\Controllers\ProductController;

Route::get('/products/{slug}', [ProductController::class, 'show'])
    ->name('products.show');


Route::get('/', [PageController::class, 'home'])->name('home');
Route::get('/login', [PageController::class, 'login'])->name('login');
Route::get('/register', [PageController::class, 'register'])->name('register');



Route::prefix('cart')->name('cart.')->group(function () {
    Route::get('/', [CartController::class, 'show'])->name('show');

    Route::post('/items', [CartController::class, 'store'])->name('items.store');
    Route::patch('/items/{product}', [CartController::class, 'update'])->name('items.update');
    Route::delete('/items/{product}', [CartController::class, 'destroy'])->name('items.destroy');
});


require __DIR__.'/settings.php';
