<?php

use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\Admin\BusinessController;
use App\Http\Controllers\Admin\OrderController;
use App\Http\Controllers\Admin\ProductController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\DashboardController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');
Route::inertia('/our-story', 'our-story')->name('our-story');
Route::inertia('/bread-and-specialties', 'bread-and-specialties')->name('bread-and-specialties');
Route::inertia('/contact', 'contact')->name('contact');

Route::inertia('/shop', 'shop')->name('shop');
Route::inertia('/featured', 'featured')->name('featured');
Route::inertia('/privacy-policy', 'privacy-policy')->name('privacy-policy');
Route::inertia('/terms-of-service', 'terms-of-service')->name('terms-of-service');
Route::inertia('/cookie-policy', 'cookie-policy')->name('cookie-policy');

Route::middleware(['auth'])->group(function () {
    Route::get('dashboard', DashboardController::class)->name('dashboard');
    Route::inertia('help', 'help')->name('help');
    Route::inertia('faqs', 'faqs')->name('faqs');
});

Route::middleware(['auth', 'role:admin|super_admin'])->group(function () {
    Route::get('admin/dashboard', AdminDashboardController::class)
        ->name('admin-dashboard');
    Route::get('admin/products', [ProductController::class, 'index'])
        ->name('admin-products');
    Route::get('admin/products/create', [ProductController::class, 'create'])
        ->name('admin-products.create');
    Route::post('admin/products', [ProductController::class, 'store'])
        ->name('admin-products.store');
    Route::get('admin/businesses', [BusinessController::class, 'index'])
        ->name('admin-businesses');
    Route::get('admin/businesses/create', [BusinessController::class, 'create'])
        ->name('admin-businesses.create');
    Route::post('admin/businesses', [BusinessController::class, 'store'])
        ->name('admin-businesses.store');
    Route::get('admin/businesses/{business}', [BusinessController::class, 'show'])
        ->name('admin-businesses.show');
    Route::get('admin/orders', [OrderController::class, 'index'])
        ->name('admin-orders');
    Route::get('admin/orders/{order}', [OrderController::class, 'show'])
        ->name('admin-orders.show');
    Route::get('admin/users/{audience}', [UserController::class, 'index'])
        ->whereIn('audience', ['customers', 'staff', 'admins'])
        ->name('admin-users');
    Route::get('admin/users/{audience}/{user}', [UserController::class, 'show'])
        ->whereIn('audience', ['customers', 'staff', 'admins'])
        ->name('admin-users.show');
});

require __DIR__.'/settings.php';
