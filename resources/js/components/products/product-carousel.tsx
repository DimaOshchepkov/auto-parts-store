import { Link } from '@inertiajs/react';
import * as React from 'react';

import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from '@/components/ui/carousel';
import type { ProductImage } from '@/types';

type Variant = 'thumb' | 'large' | 'original';

// Wayfinder route() иногда возвращает объект, который приводится к string.
// Делаем максимально мягкий тип.
type HrefLike = string | { toString(): string };

interface ProductCarouselProps {
    images: ProductImage[];
    variant?: Variant;

    /** Wayfinder route(...) или строка */
    href?: HrefLike;

    onImageClick?: (index: number, image: ProductImage) => void;
    disableImageClick?: boolean;
    prefetch?: boolean;
    className?: string;
}

export function ProductCarousel({
    images,
    variant = 'thumb',
    href,
    onImageClick,
    disableImageClick = false,
    prefetch = true,
    className,
}: ProductCarouselProps) {
    const list = Array.isArray(images) ? images : [];

    if (!list.length) {
        return (
            <div className="flex aspect-square w-full items-center justify-center rounded-xl bg-muted text-sm text-muted-foreground">
                Нет изображений
            </div>
        );
    }

    const pickSrc = (img: ProductImage) => {
        if (variant === 'thumb') return img.thumb_webp || img.url;
        if (variant === 'large') return img.large_webp || img.url;
        return img.url;
    };

    const hrefString = href ? href.toString() : undefined;
    const isClickable = !disableImageClick && (!!hrefString || !!onImageClick);

    const handleImageClick =
        (index: number, img: ProductImage) => (e: React.MouseEvent) => {
            if (!isClickable) return;

            if (onImageClick) {
                e.preventDefault();
                e.stopPropagation();
                onImageClick(index, img);
            }
        };


    return (
        <Carousel
            className={['relative w-full', className].filter(Boolean).join(' ')}
        >
            <CarouselContent>
                {list.map((img, index) => (
                    <CarouselItem key={img.id ?? index}>
                        <div className="aspect-square overflow-hidden rounded-xl">
                            {isClickable && hrefString ? (
                                <Link
                                    href={hrefString}
                                    prefetch={prefetch}
                                    className="block h-full w-full"
                                    onClick={handleImageClick(index, img)}
                                >
                                    <img
                                        src={pickSrc(img)}
                                        alt={`Product image ${index + 1}`}
                                        className="h-full w-full object-cover"
                                        loading={index === 0 ? 'eager' : 'lazy'}
                                        decoding="async"
                                    />
                                </Link>
                            ) : (
                                <button
                                    type="button"
                                    className={[
                                        'block h-full w-full',
                                        isClickable
                                            ? 'cursor-pointer'
                                            : 'cursor-default',
                                    ].join(' ')}
                                    onClick={handleImageClick(index, img)}
                                    disabled={!isClickable}
                                >
                                    <img
                                        src={pickSrc(img)}
                                        alt={`Product image ${index + 1}`}
                                        className="h-full w-full object-cover"
                                        loading={index === 0 ? 'eager' : 'lazy'}
                                        decoding="async"
                                    />
                                </button>
                            )}
                        </div>
                    </CarouselItem>
                ))}
            </CarouselContent>

            {list.length > 1 && (
                <>
                    <CarouselPrevious
                        className="absolute top-0! left-0! z-20 flex h-full w-12 translate-y-0! items-center justify-center border-0 bg-transparent opacity-10 shadow-none transition-opacity duration-300 group-hover:opacity-30 hover:opacity-50 disabled:opacity-0"
                    />
                    <CarouselNext
                        className="absolute top-0! right-0! z-20 flex h-full w-12 translate-y-0! items-center justify-center border-0 bg-transparent opacity-10 shadow-none transition-opacity duration-300 group-hover:opacity-30 hover:opacity-50 disabled:opacity-10"
                    />
                </>
            )}
        </Carousel>
    );
}
