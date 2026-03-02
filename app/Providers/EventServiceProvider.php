<?php

namespace App\Providers;

use App\Listeners\MergeGuestCart;
use Illuminate\Auth\Events\Login;
use Illuminate\Support\ServiceProvider;

class EventServiceProvider extends ServiceProvider
{
    protected array $listen = [
        Login::class => [
            MergeGuestCart::class,
        ],
    ];
}
