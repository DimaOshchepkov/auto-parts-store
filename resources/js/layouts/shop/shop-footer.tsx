import { Link } from '@inertiajs/react';
import * as React from 'react';
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';

export function ShopFooter() {
    return (
        <footer className="mt-10 border-t">
            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col gap-6 md:flex-row md:justify-between">
                    {/* Название */}
                    <div>
                        <h3 className="text-lg font-semibold">
                            Магазин запчастей
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            Всё для вашего авто
                        </p>
                    </div>

                    {/* Контакты */}
                    <NavigationMenu>
                        <NavigationMenuList className="flex flex-wrap items-start gap-2">
                            <NavigationMenuItem>
                                <NavigationMenuLink
                                    asChild
                                    className={navigationMenuTriggerStyle()}
                                >
                                    <a href="tel:+1234567890">
                                        📞 +1 (234) 567-890
                                    </a>
                                </NavigationMenuLink>
                            </NavigationMenuItem>

                            <NavigationMenuItem>
                                <NavigationMenuLink
                                    asChild
                                    className={navigationMenuTriggerStyle()}
                                >
                                    <a href="mailto:info@autoparts.com">
                                        ✉ info@autoparts.com
                                    </a>
                                </NavigationMenuLink>
                            </NavigationMenuItem>

                            <NavigationMenuItem>
                                <NavigationMenuLink
                                    asChild
                                    className={navigationMenuTriggerStyle()}
                                >
                                    <Link href="/contacts">
                                        Контактная информация
                                    </Link>
                                </NavigationMenuLink>
                            </NavigationMenuItem>
                        </NavigationMenuList>
                    </NavigationMenu>
                </div>

                <div className="mt-8 text-center text-xs text-muted-foreground">
                    © {new Date().getFullYear()} Магазин запчастей. Все права
                    защищены.
                </div>
            </div>
        </footer>
    );
}
