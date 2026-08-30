<?php

namespace Database\Factories;

use App\Models\Product;
use App\Models\ProductCategory;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Product>
 */
class ProductFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = fake()->words(3, true);

        return [
            'name' => $name,
            'slug' => Str::slug($name).'-'.fake()->unique()->numerify('####'),
            'description' => fake()->optional()->sentence(),
            'category_id' => ProductCategory::factory(),
            'price' => fake()->optional()->randomFloat(2, 2, 40),
            'featured' => false,
            'is_available' => true,
            'created_by' => User::factory(),
        ];
    }

    public function pastry(): static
    {
        return $this->state(fn (): array => [
            'category_id' => ProductCategory::query()->firstOrCreate(
                ['slug' => 'pastry'],
                ['name' => 'Pastry'],
            )->id,
        ]);
    }

    public function breadAndSpecialties(): static
    {
        return $this->state(fn (): array => [
            'category_id' => ProductCategory::query()->firstOrCreate(
                ['slug' => 'bread-and-specialties'],
                ['name' => 'Bread & Specialties'],
            )->id,
        ]);
    }

    public function featured(): static
    {
        return $this->state(fn (): array => [
            'featured' => true,
        ]);
    }
}
