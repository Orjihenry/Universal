<?php

namespace Database\Factories;

use App\Enums\OrderStatus;
use App\Models\Order;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Order>
 */
class OrderFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'status' => OrderStatus::Pending,
            'total' => fake()->randomFloat(2, 5, 80),
        ];
    }

    public function pending(): static
    {
        return $this->state(fn (): array => [
            'status' => OrderStatus::Pending,
        ]);
    }

    public function readyForPickup(): static
    {
        return $this->state(fn (): array => [
            'status' => OrderStatus::ReadyForPickup,
        ]);
    }

    public function completed(): static
    {
        return $this->state(fn (): array => [
            'status' => OrderStatus::Completed,
        ]);
    }

    public function cancelled(): static
    {
        return $this->state(fn (): array => [
            'status' => OrderStatus::Cancelled,
        ]);
    }
}
