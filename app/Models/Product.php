<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class Product extends Model implements HasMedia
{
    use InteractsWithMedia;
    use HasFactory;

    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('images')
            ->useDisk('public');
    }
    public function mediaCustomProperties(Media $media): array
    {
        return [
            'alt' => (string) ($this->name ?? ''),
        ];
    }

    public function registerMediaConversions(Media $media = null): void
    {
        $this->addMediaConversion('thumb_webp')
            ->width(300)
            ->format('webp')
            ->quality(85)
            ->queued();

        $this->addMediaConversion('large_webp')
            ->width(1200)
            ->format('webp')
            ->quality(90)
            ->queued();
    }


    protected $fillable = [
        'name',
        'slug',
        'category_id',
        'brand_id',
        'sku',
        'description',
        'price',
        'cost_price',
        'stock_quantity',
        'is_active',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'cost_price' => 'decimal:2',
        'is_active' => 'boolean',
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function brand(): BelongsTo
    {
        return $this->belongsTo(Brand::class);
    }

    public function orderItems(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    protected static function booted(): void
    {
        static::creating(function ($product) {
            if (! $product->slug) {
                $product->slug = Str::slug($product->name);
            }
        });
    }

    protected $appends = ['images'];

    public function getImagesAttribute()
    {
        return $this->getMedia('images')->map(fn ($media) => [
            'id' => $media->id,
            'url' => $media->getUrl(),
            'thumb_webp' => $media->getUrl('thumb_webp'),
            'large_webp' => $media->getUrl('large_webp'),
            'alt' => $media->getCustomProperty('alt'),
        ]);
    }
}
