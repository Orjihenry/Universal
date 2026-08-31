<?php

use App\Models\Business;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Database\Seeders\DatabaseSeeder;

test('the demo seeder creates users products businesses and orders', function () {
    $this->seed(DatabaseSeeder::class);

    expect(User::query()->where('email', 'test@example.com')->first()?->hasRole('super_admin'))->toBeTrue()
        ->and(User::query()->where('email', 'admin@example.com')->first()?->hasRole('admin'))->toBeTrue()
        ->and(User::query()->where('email', 'staff@example.com')->first()?->hasRole('staff'))->toBeTrue()
        ->and(User::query()->where('email', 'customer@example.com')->first()?->hasRole('user'))->toBeTrue()
        ->and(User::query()->customers()->count())->toBeGreaterThan(1)
        ->and(User::query()->staff()->count())->toBeGreaterThan(1)
        ->and(User::query()->admins()->count())->toBeGreaterThan(1)
        ->and(Product::query()->count())->toBeGreaterThan(0)
        ->and(Product::query()->unavailable()->count())->toBeGreaterThan(0)
        ->and(Business::query()->approved()->count())->toBeGreaterThan(0)
        ->and(Business::query()->pending()->count())->toBeGreaterThan(0)
        ->and(Order::query()->pending()->count())->toBeGreaterThan(0)
        ->and(Order::query()->completed()->count())->toBeGreaterThan(0)
        ->and(Order::query()->placedToday()->count())->toBeGreaterThan(0);
});
