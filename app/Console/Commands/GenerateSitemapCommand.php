<?php

namespace App\Console\Commands;

use App\Models\Product;
use Illuminate\Console\Command;
use Spatie\Sitemap\Sitemap;
use Spatie\Sitemap\Tags\Url;

class GenerateSitemapCommand extends Command
{
    protected $signature = 'sitemap:generate {--path= : Absolute path to the generated sitemap.xml file}';
    protected $description = 'Generate sitemap.xml from public pages and product pages';

    public function handle(): int
    {
        $sitemap = Sitemap::create();

        // 1) Статичные публичные страницы (явно)
        $static = [
            url('/'),               // главная
            url('/products'),       // каталог (если есть)
            // url('/about'),
            // url('/contacts'),
            // url('/delivery'),
        ];

        foreach ($static as $loc) {
            $sitemap->add(
                Url::create($loc)->setLastModificationDate(now())
            );
        }

        // 2) Товары
        Product::query()
            ->where('is_active', true)
            ->select(['id', 'slug', 'updated_at'])
            ->orderBy('id')
            ->chunkById(500, function ($products) use ($sitemap) {
                foreach ($products as $product) {
                    $sitemap->add(
                        Url::create(route('products.show', ['slug' => $product->slug]))
                            ->setLastModificationDate($product->updated_at ?? now())
                    );
                }
            });

        $path = $this->option('path') ?: public_path('sitemap.xml');
        $sitemap->writeToFile($path);

        $this->info("Sitemap generated: {$path}");
        return self::SUCCESS;
    }
}
