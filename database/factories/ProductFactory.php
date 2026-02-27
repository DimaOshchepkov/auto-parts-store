<?php

namespace Database\Factories;

use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Carbon;

class ProductFactory extends Factory
{
    protected $model = Product::class;

    public function definition(): array
    {
        return [
            'name' => $this->faker->name(),
            'slug' => $this->faker->slug(),
            'sku' => $this->faker->word(),
            'description' => $this->faker->text(),
            'price' => $this->faker->randomFloat(),
            'cost_price' => $this->faker->randomFloat(),
            'stock_quantity' => $this->faker->randomNumber(),
            'is_active' => $this->faker->boolean(),
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),

            'category_id' => Category::factory(),
            'brand_id' => Brand::factory(),
        ];
    }
}
