<?php

namespace Database\Factories;

use App\Enums\BusinessStatus;
use App\Models\Business;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Business>
 */
class BusinessFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->company(),
            'address' => fake()->streetAddress(),
            'phone' => fake()->phoneNumber(),
            'email' => fake()->unique()->companyEmail(),
            'website' => fake()->optional()->url(),
            'business_type' => fake()->randomElement(Business::TYPES),
            'city' => fake()->city(),
            'state' => fake()->stateAbbr(),
            'status' => BusinessStatus::Pending,
            'created_by' => User::factory(),
        ];
    }

    /**
     * Indicate that the business has been approved.
     */
    public function approved(?User $approver = null): static
    {
        return $this->state(fn (): array => [
            'status' => BusinessStatus::Approved,
            'approved_by' => $approver ?? User::factory(),
            'approved_at' => now(),
        ]);
    }

    public function suspended(): static
    {
        return $this->state(fn (): array => [
            'status' => BusinessStatus::Suspended,
        ]);
    }
}
