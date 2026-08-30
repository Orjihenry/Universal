<?php

use App\Models\Product;
use App\Models\ProductCategory;
use App\Models\User;
use Database\Seeders\ProductCategorySeeder;
use Database\Seeders\RolesAndPermissionsSeeder;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function () {
    $this->seed([
        RolesAndPermissionsSeeder::class,
        ProductCategorySeeder::class,
    ]);
});

test('guests are redirected from the product form', function () {
    $this->get(route('admin-products.create'))
        ->assertRedirect(route('login'));
});

test('regular users cannot view the product form', function () {
    $user = User::factory()->user()->create();

    $this->actingAs($user)
        ->get(route('admin-products.create'))
        ->assertForbidden();
});

test('admins can view the create product form', function () {
    $admin = User::factory()->admin()->create();

    $this->actingAs($admin)
        ->get(route('admin-products.create'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/products/create')
            ->has('categories', 2)
            ->where('defaultCategoryId', null));
});

test('the create form prefills category from the query string', function () {
    $admin = User::factory()->admin()->create();
    $pastry = ProductCategory::query()->where('slug', 'pastry')->first();

    $this->actingAs($admin)
        ->get(route('admin-products.create', ['category' => $pastry->slug]))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/products/create')
            ->where('defaultCategoryId', $pastry->id));
});

test('admins can create a product', function () {
    $admin = User::factory()->admin()->create();
    $bread = ProductCategory::query()->where('slug', 'bread-and-specialties')->first();

    $response = $this->actingAs($admin)
        ->post(route('admin-products.store'), [
            'name' => 'Sourdough boule',
            'description' => 'A slow-fermented country loaf.',
            'category_id' => $bread->id,
            'price' => '8.50',
            'featured' => '1',
            'is_available' => '1',
        ]);

    $product = Product::query()->where('name', 'Sourdough boule')->first();

    expect($product)->not->toBeNull()
        ->and($product->category_id)->toBe($bread->id)
        ->and($product->category->is($bread))->toBeTrue()
        ->and($product->featured)->toBeTrue()
        ->and($product->is_available)->toBeTrue()
        ->and($product->created_by)->toBe($admin->id)
        ->and($admin->products)->toHaveCount(1);

    $this->assertModelExists($product);

    $response->assertRedirect(route('admin-products', [
        'category' => $bread->slug,
    ]));
});

test('product name and category are required', function () {
    $admin = User::factory()->admin()->create();

    $this->actingAs($admin)
        ->from(route('admin-products.create'))
        ->post(route('admin-products.store'), [])
        ->assertRedirect(route('admin-products.create'))
        ->assertSessionHasErrors(['name', 'category_id']);
});

test('category must exist', function () {
    $admin = User::factory()->admin()->create();

    $this->actingAs($admin)
        ->from(route('admin-products.create'))
        ->post(route('admin-products.store'), [
            'name' => 'Sourdough boule',
            'category_id' => 999,
        ])
        ->assertRedirect(route('admin-products.create'))
        ->assertSessionHasErrors(['category_id']);
});

test('the products index lists items for the selected category', function () {
    $admin = User::factory()->admin()->create();
    $pastry = ProductCategory::query()->where('slug', 'pastry')->first();
    $pastryProduct = Product::factory()->recycle([$admin, $pastry])->create(['name' => 'Croissant']);
    Product::factory()->breadAndSpecialties()->recycle($admin)->create(['name' => 'Rye loaf']);

    $this->actingAs($admin)
        ->get(route('admin-products', ['category' => $pastry->slug]))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/products/index')
            ->has('products', 1)
            ->where('products.0.name', $pastryProduct->name)
            ->where('category', $pastry->slug));
});
