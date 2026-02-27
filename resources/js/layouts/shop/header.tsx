import { Link } from '@inertiajs/react';
import { Menu } from 'lucide-react';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';

export type NavItem = {
    title: React.ReactNode;
    href: string;
    disabled?: boolean;
};

type AppHeaderProps = {
    brand?: React.ReactNode;
    brandHref?: string;
    items?: NavItem[];

    /** Заголовок в мобильном меню */
    mobileTitle?: string;

    /** Правая зона (например: профиль/поиск/кнопки) */
    rightSlot?: React.ReactNode;

    /** Классы для контейнера */
    className?: string;
};

export function Header({
    brand = 'Магазин запчастей',
    brandHref = '/',
    items = [],
    mobileTitle = 'Меню',
    rightSlot,
    className,
}: AppHeaderProps) {
    return (
        <header className={['border-b', className].filter(Boolean).join(' ')}>
            <div className="container mx-auto flex h-14 items-center justify-between px-4">
                <Link
                    href={brandHref}
                    className="min-w-0 truncate font-semibold"
                >
                    {brand}
                </Link>

                {/* Desktop */}
                <div className="hidden items-center gap-2 md:flex">
                    {items.length > 0 ? (
                        <NavigationMenu>
                            <NavigationMenuList>
                                {items.map((item) => (
                                    <NavigationMenuItem key={String(item.href)}>
                                        <NavigationMenuLink
                                            asChild
                                            className={navigationMenuTriggerStyle()}
                                            aria-disabled={item.disabled}
                                        >
                                            <Link
                                                href={item.href}
                                                className={
                                                    item.disabled
                                                        ? 'pointer-events-none opacity-50'
                                                        : ''
                                                }
                                            >
                                                {item.title}
                                            </Link>
                                        </NavigationMenuLink>
                                    </NavigationMenuItem>
                                ))}
                            </NavigationMenuList>
                        </NavigationMenu>
                    ) : null}

                    {rightSlot ? <div className="ml-2">{rightSlot}</div> : null}
                </div>

                {/* Mobile */}
                <div className="flex items-center gap-2 md:hidden">
                    {rightSlot ? <div>{rightSlot}</div> : null}

                    {items.length > 0 ? (
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    aria-label="Открыть меню"
                                >
                                    <Menu className="h-5 w-5" />
                                </Button>
                            </SheetTrigger>

                            {/* Важно: ограничиваем по viewport, чтобы не уезжал крестик */}
                            <SheetContent
                                side="right"
                                className="w-[min(320px,100vw)] max-w-none pr-12"
                            >
                                <SheetHeader>
                                    <SheetTitle>{mobileTitle}</SheetTitle>
                                </SheetHeader>

                                <nav className="mt-6 flex flex-col gap-2">
                                    {items.map((item) => (
                                        <Link
                                            key={String(item.href)}
                                            href={item.href}
                                            className={[
                                                'rounded-md px-3 py-2 text-sm hover:bg-muted',
                                                item.disabled
                                                    ? 'pointer-events-none opacity-50'
                                                    : '',
                                            ].join(' ')}
                                        >
                                            {item.title}
                                        </Link>
                                    ))}
                                </nav>
                            </SheetContent>
                        </Sheet>
                    ) : null}
                </div>
            </div>
        </header>
    );
}


