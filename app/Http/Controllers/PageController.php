<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Inertia\Inertia;

class PageController
{
    public function home()
    {
        return Inertia::render('home', [
            'products' => Product::with('media')->latest()->get(),
        ]);
    }

    public function login()
    {
        return Inertia::render('auth/login');
    }

    public function register()
    {
        return Inertia::render('auth/register');
    }
}
