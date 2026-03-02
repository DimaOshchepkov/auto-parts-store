
export interface ProductImage {
    id: number | string;
    url: string;
    thumb_webp?: string | null;
    large_webp?: string | null;
    alt?: string | null;
}

export interface Product {
    id: number;
    name: string;
    price: string;
    description: string;
    slug: string;
    images: ProductImage[];
}
