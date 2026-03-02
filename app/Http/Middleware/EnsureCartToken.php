<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\Response;

class EnsureCartToken
{
    public const COOKIE_NAME = 'cart_token';
    /**
     * @param Closure(Request): (Response) $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Для залогиненных токен не обязателен
        if (Auth::check()) {
            return $next($request);
        }

        $token = $request->cookie(self::COOKIE_NAME);

        if (! $token) {
            $token = Str::random(64);

            // ВАЖНО: Cookie::queue прикрепит cookie к Response автоматически
            Cookie::queue(
                Cookie::make(
                    name: self::COOKIE_NAME,
                    value: $token,
                    minutes: 60 * 24 * 30, // 30 дней
                    path: '/',
                    secure: app()->environment('production'),
                    sameSite: 'Lax'
                )
            );
        }

        // Чтобы токен был доступен в этом же запросе (даже если cookie только что поставили)
        $request->attributes->set(self::COOKIE_NAME, $token);

        return $next($request);
    }
}
