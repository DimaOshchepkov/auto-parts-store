<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

class DashboardController extends Controller
{
    public function __invoke(): InertiaResponse
    {
        $products = Product::query()
            ->select(['id', 'name', 'price', 'description'])
            ->orderBy('id', 'asc')
            ->limit(20)
            ->get();

        return Inertia::render('dashboard', [
            'products' => $products,
        ]);
    }
}
