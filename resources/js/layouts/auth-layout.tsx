import * as React from 'react';
import { ShopFooter } from '@/layouts/shop/shop-footer';
import { ShopHeader } from '@/layouts/shop/shop-header';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

type AuthLayoutProps = {
    title: string;
    description?: string;
    children: React.ReactNode;
};

export default function AuthLayout({
    title,
    description,
    children,
}: AuthLayoutProps) {
    return (
        <div className="flex min-h-screen flex-col bg-background">
            <ShopHeader />

            <main className="w-full flex-1">
                {/* Отступы от хедера/футера */}
                <div className="px-4 py-12 md:py-16">
                    {/* Центрируем и фиксируем ширину */}
                    <div className="mx-auto w-full max-w-[420px]">
                        <Card className="w-full rounded-2xl">
                            <CardHeader className="px-6 pt-6 md:px-8 md:pt-8">
                                <CardTitle className="text-2xl">
                                    {title}
                                </CardTitle>
                                {description ? (
                                    <CardDescription className="mt-2">
                                        {description}
                                    </CardDescription>
                                ) : null}
                            </CardHeader>

                            <CardContent className="px-6 pb-6 md:px-8 md:pb-8">
                                {children}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>

            <ShopFooter />
        </div>
    );
}
