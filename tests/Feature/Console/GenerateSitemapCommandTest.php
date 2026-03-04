<?php

use App\Models\Product;
use Illuminate\Support\Facades\File;

it('generates sitemap with public routes and active products', function () {
    Product::factory()->create([
        'slug' => 'active-product',
        'is_active' => true,
    ]);

    Product::factory()->create([
        'slug' => 'inactive-product',
        'is_active' => false,
    ]);

    $path = storage_path('framework/testing/sitemap-test.xml');

    File::ensureDirectoryExists(dirname($path));
    File::delete($path);

    $this->artisan('sitemap:generate', ['--path' => $path])
        ->assertSuccessful();

    expect(File::exists($path))->toBeTrue();

    $content = File::get($path);

    expect($content)->toContain('/cart');
    expect($content)->toContain('/products/active-product');
    expect($content)->not->toContain('/products/inactive-product');
    expect($content)->not->toContain('/settings/profile');
    expect($content)->not->toContain('/admin/products');

    File::delete($path);
});
