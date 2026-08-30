<?php

use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\Admin\ProductController;
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
});

require __DIR__.'/settings.php';
