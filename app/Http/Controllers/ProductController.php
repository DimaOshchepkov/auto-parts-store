<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function show(string $slug)
    {
        $product = Product::query()
            ->where('slug', $slug)
            ->firstOrFail();

        return Inertia::render('product-show', [
            'product' => [
                'id' => $product->id,
                'slug' => $product->slug,
                'name' => $product->name,
                'price' => (string) $product->price,
                'description' => $product->description,
                'images' => $product->images,
            ],
        ]);
    }
}
