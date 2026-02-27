import * as React from 'react';
import type { NavItem } from '@/layouts/shop/header';
import { Header } from '@/layouts/shop/header';

const nav: NavItem[] = [
    { title: 'Главная', href: '/' },
    { title: 'Корзина', href: '/cart' },
    { title: 'Вход', href: '/login' },
    { title: 'Регистрация', href: '/register' },
];

export function ShopHeader() {
    return (
        <Header
            brand="Магазин запчастей"
            brandHref="/"
            items={nav}
            mobileTitle="Меню"
        />
    );
}
