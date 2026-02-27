<?php

use App\Http\Controllers\DashboardController;
use App\Models\Product;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;


Route::get('dashboard', DashboardController::class)
    ->middleware(['auth', 'verified'])
    ->name('dashboard');

Route::get('/', function () {
    return Inertia::render('home', [
        'products' => Product::latest()->take(12)->get(),
    ]);
})->name('home');

require __DIR__.'/settings.php';
