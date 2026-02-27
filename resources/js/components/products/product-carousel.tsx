import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from '@/components/ui/carousel';

interface ProductCarouselProps {
    images: string[];
}

export function ProductCarousel({ images }: ProductCarouselProps) {
    if (!images?.length) {
        return (
            <div className="flex aspect-square w-full items-center justify-center rounded-xl bg-muted text-sm text-muted-foreground">
                Нет изображений
            </div>
        );
    }

    return (
        <Carousel className="relative w-full max-w-sm">
            <CarouselContent>
                {images.map((url, index) => (
                    <CarouselItem key={index}>
                        <div className="aspect-square overflow-hidden rounded-xl">
                            <img
                                src={url}
                                alt={`Product image ${index + 1}`}
                                className="h-full w-full object-cover"
                            />
                        </div>
                    </CarouselItem>
                ))}
            </CarouselContent>

            {images.length > 1 && (
                <>
                    <CarouselPrevious className="absolute top-0! left-0! z-20 flex h-full w-12 translate-y-0! items-center justify-center border-0 bg-transparent opacity-10 shadow-none transition-opacity duration-300 group-hover:opacity-30 hover:opacity-50 disabled:opacity-10">
                    </CarouselPrevious>
                    <CarouselNext className="absolute top-0! right-0! z-20 flex h-full w-12 translate-y-0! items-center justify-center border-0 bg-transparent opacity-10 shadow-none transition-opacity duration-300 group-hover:opacity-30 hover:opacity-50 disabled:opacity-10">
                    </CarouselNext>
                </>
            )}
        </Carousel>
    );
}
