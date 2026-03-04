import { Link, router, usePage } from '@inertiajs/react';
import { Menu } from 'lucide-react';
import * as React from 'react';

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
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

import { logout } from '@/routes';
import type { User } from '@/types';
import { cn } from '@/lib/utils';



type NavItem = {
    title: React.ReactNode;
    href: string;
    disabled?: boolean;
    method?: 'get' | 'post' | 'delete' | 'patch' | 'put';
    onClick?: () => void;
};

type PageProps = {
    auth?: {
        user?: User | null;
    };
};

type ShopHeaderProps = {
    brand?: React.ReactNode;
    brandHref?: string;
    mobileTitle?: string;
    rightSlot?: React.ReactNode;

    logoutHref?: string;
    logoutMethod?: 'post' | 'delete';
};

export function ShopHeader({
    brand = 'Магазин запчастей',
    brandHref = '/',
    mobileTitle = 'Меню',
    rightSlot,
}: ShopHeaderProps) {
    const { props } = usePage<PageProps>();
    const user = props?.auth?.user ?? null;
    const isAuthed = Boolean(user);

    const [logoutOpen, setLogoutOpen] = React.useState(false);

    const items: NavItem[] = [
        { title: 'Главная', href: '/' },
        { title: 'Корзина', href: '/cart' },
        ...(isAuthed
            ? [
                  {
                      title: 'Выход',
                      href: '#', // можно оставить, но не используется
                      onClick: () => setLogoutOpen(true),
                  },
              ]
            : [
                  { title: 'Вход', href: '/login' },
                  { title: 'Регистрация', href: '/register' },
              ]),
    ];

    const doLogout = () => {
        setLogoutOpen(false);
        router.post(logout());
    };

    const renderNavLink = (item: NavItem, className?: string) => {
        const isDisabled = Boolean(item.disabled);

        if (item.onClick) {
            return (
                <Button
                    type="button"
                    variant="ghost"
                    onClick={item.onClick}
                    disabled={isDisabled}
                    className={cn('w-full justify-start', className)}
                >
                    {item.title}
                </Button>
            );
        }

        return (
            <Link
                href={item.href}
                className={cn(
                    'flex w-full',
                    className,
                    isDisabled && 'pointer-events-none opacity-50',
                )}
            >
                {item.title}
            </Link>
        );
    };

    return (
        <>
            <header className="border-b">
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
                                        <NavigationMenuItem
                                            key={String(item.href)}
                                        >
                                            <NavigationMenuLink
                                                asChild
                                                className={navigationMenuTriggerStyle()}
                                                aria-disabled={item.disabled}
                                            >
                                                {renderNavLink(item)}
                                            </NavigationMenuLink>
                                        </NavigationMenuItem>
                                    ))}
                                </NavigationMenuList>
                            </NavigationMenu>
                        ) : null}

                        {rightSlot ? (
                            <div className="ml-2">{rightSlot}</div>
                        ) : null}
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

                                <SheetContent
                                    side="right"
                                    className="w-[min(320px,100vw)] max-w-none pr-12"
                                >
                                    <SheetHeader>
                                        <SheetTitle>{mobileTitle}</SheetTitle>
                                    </SheetHeader>

                                    <nav className="mt-6 flex flex-col gap-2">
                                        {items.map((item) => (
                                            <div key={String(item.href)}>
                                                {renderNavLink(
                                                    item,
                                                    'w-full justify-start rounded-md px-3 py-2 text-sm hover:bg-muted',
                                                )}
                                            </div>
                                        ))}
                                    </nav>
                                </SheetContent>
                            </Sheet>
                        ) : null}
                    </div>
                </div>
            </header>

            {/* Confirm logout */}
            <AlertDialog open={logoutOpen} onOpenChange={setLogoutOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Выйти из аккаунта?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Вы сможете войти снова в любой момент.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Отмена</AlertDialogCancel>
                        <AlertDialogAction asChild>
                            <Button
                                variant="destructive"
                                onClick={doLogout}
                                className="transition-all duration-200 hover:brightness-110 active:scale-95"
                            >
                                Выйти
                            </Button>
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
