<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreProductRequest;
use App\Models\Product;
use App\Models\ProductCategory;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    public function index(Request $request): Response
    {
        $category = ProductCategory::query()
            ->where('slug', $request->query('category'))
            ->first();

        $products = Product::query()
            ->with('category')
            ->when($category, fn ($query) => $query->ofCategory($category))
            ->latest()
            ->get()
            ->map(fn (Product $product): array => [
                'id' => $product->id,
                'name' => $product->name,
                'category' => $product->category->slug,
                'categoryLabel' => $product->category->name,
                'price' => $product->price,
                'featured' => $product->featured,
                'isAvailable' => $product->is_available,
            ]);

        return Inertia::render('admin/products/index', [
            'products' => $products,
            'category' => $category?->slug,
            'categoryLabel' => $category?->name,
        ]);
    }

    public function create(Request $request): Response
    {
        $category = ProductCategory::query()
            ->where('slug', $request->query('category'))
            ->first();

        return Inertia::render('admin/products/create', [
            'categories' => ProductCategory::query()
                ->orderBy('name')
                ->get(['id', 'name', 'slug']),
            'defaultCategoryId' => $category?->id,
        ]);
    }

    public function store(StoreProductRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        $product = Product::create([
            ...$validated,
            'slug' => $this->uniqueSlug($validated['name']),
            'created_by' => $request->user()->id,
        ]);

        $product->load('category');

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Product created.')]);

        return to_route('admin-products', array_filter([
            'category' => $product->category->slug,
        ]));
    }

    private function uniqueSlug(string $name): string
    {
        $slug = Str::slug($name);

        if ($slug === '' || Product::query()->where('slug', $slug)->exists()) {
            $slug = $slug === '' ? Str::lower(Str::random(8)) : $slug.'-'.Str::lower(Str::random(6));
        }

        return $slug;
    }
}
