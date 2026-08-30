<?php

namespace Database\Seeders;

use App\Models\ProductCategory;
use Illuminate\Database\Seeder;

class ProductCategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        ProductCategory::query()->firstOrCreate(
            ['slug' => 'bread-and-specialties'],
            ['name' => 'Bread & Specialties'],
        );

        ProductCategory::query()->firstOrCreate(
            ['slug' => 'pastry'],
            ['name' => 'Pastry'],
        );
    }
}
