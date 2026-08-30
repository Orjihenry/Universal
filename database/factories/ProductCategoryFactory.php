<?php

namespace Database\Factories;

use App\Models\ProductCategory;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<ProductCategory>
 */
class ProductCategoryFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = fake()->unique()->words(2, true);

        return [
            'name' => Str::title($name),
            'slug' => Str::slug($name),
        ];
    }

    public function breadAndSpecialties(): static
    {
        return $this->state(fn (): array => [
            'name' => 'Bread & Specialties',
            'slug' => 'bread-and-specialties',
        ]);
    }

    public function pastry(): static
    {
        return $this->state(fn (): array => [
            'name' => 'Pastry',
            'slug' => 'pastry',
        ]);
    }
}
