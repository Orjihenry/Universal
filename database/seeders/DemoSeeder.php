<?php

namespace Database\Seeders;

use App\Models\Business;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Seeder;

class DemoSeeder extends Seeder
{
    /**
     * Seed demo users, products, businesses, and orders for local admin testing.
     */
    public function run(): void
    {
        User::factory()->superAdmin()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
            'phone' => '08011111111',
        ]);
        $admin = User::factory()->admin()->create([
            'name' => 'Amina Bello',
            'email' => 'admin@example.com',
            'phone' => '08011111112',
        ]);
        User::factory()->staff()->create([
            'name' => 'Chidi Okonkwo',
            'email' => 'staff@example.com',
            'phone' => '08011111113',
        ]);
        $customer = User::factory()->user()->create([
            'name' => 'Ada Lovelace',
            'email' => 'customer@example.com',
            'phone' => '08011111114',
        ]);

        User::factory()->admin()->create();
        User::factory()->staff()->count(2)->create();

        $customers = User::factory()->user()->count(10)->create()
            ->prepend($customer);

        $this->seedProducts($admin);
        $this->seedBusinesses($customers, $admin);
        $this->seedOrders($customers);
    }

    private function seedProducts(User $admin): void
    {
        Product::factory()
            ->recycle($admin)
            ->breadAndSpecialties()
            ->featured()
            ->create([
                'name' => 'Sourdough boule',
                'description' => 'A slow-fermented country loaf.',
                'price' => '8.50',
            ]);
        Product::factory()
            ->recycle($admin)
            ->breadAndSpecialties()
            ->count(5)
            ->create();
        Product::factory()
            ->recycle($admin)
            ->pastry()
            ->featured()
            ->create([
                'name' => 'Butter croissant',
                'price' => '4.00',
            ]);
        Product::factory()
            ->recycle($admin)
            ->pastry()
            ->count(4)
            ->create();
        Product::factory()
            ->recycle($admin)
            ->pastry()
            ->unavailable()
            ->count(2)
            ->create();
        Product::factory()
            ->recycle($admin)
            ->breadAndSpecialties()
            ->unavailable()
            ->create();
    }

    /**
     * @param  Collection<int, User>  $customers
     */
    private function seedBusinesses(Collection $customers, User $admin): void
    {
        Business::factory()
            ->recycle($customers)
            ->approved($admin)
            ->count(5)
            ->create();
        Business::factory()
            ->recycle($customers)
            ->count(3)
            ->create();
        Business::factory()
            ->recycle($customers)
            ->suspended()
            ->count(2)
            ->create();
        Business::factory()
            ->recycle($customers)
            ->rejected()
            ->create();
    }

    /**
     * @param  Collection<int, User>  $customers
     */
    private function seedOrders(Collection $customers): void
    {
        Order::factory()
            ->recycle($customers)
            ->pending()
            ->count(4)
            ->create();
        Order::factory()
            ->recycle($customers)
            ->readyForPickup()
            ->count(3)
            ->create();
        Order::factory()
            ->recycle($customers)
            ->cancelled()
            ->count(2)
            ->create();

        foreach (range(0, 13) as $daysAgo) {
            Order::factory()
                ->recycle($customers)
                ->completed()
                ->placedOn(now()->subDays($daysAgo)->setTime(10, 30))
                ->count($daysAgo % 3 === 0 ? 2 : 1)
                ->create();
        }
    }
}
