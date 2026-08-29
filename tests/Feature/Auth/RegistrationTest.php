<?php

use App\Models\User;
use Database\Seeders\RolesAndPermissionsSeeder;

test('registration screen can be rendered', function () {
    $response = $this->get(route('register'));

    $response->assertOk();
});

test('new users can register with the user role', function () {
    $this->seed(RolesAndPermissionsSeeder::class);

    $response = $this->post(route('register.store'), [
        'name' => 'Test User',
        'email' => 'test@example.com',
        'phone' => '+15555550100',
        'password' => 'password',
        'password_confirmation' => 'password',
        'role' => 'admin',
    ]);

    $this->assertAuthenticated();

    $user = User::where('email', 'test@example.com')->first();

    expect($user)->not->toBeNull()
        ->and($user->hasRole('user'))->toBeTrue()
        ->and($user->hasRole('admin'))->toBeFalse();

    $response->assertRedirect(route('dashboard'));
});

test('user factory staff and admin states assign spatie roles', function () {
    $this->seed(RolesAndPermissionsSeeder::class);

    $staff = User::factory()->staff()->create();
    $admin = User::factory()->admin()->create();

    expect($staff->hasRole('staff'))->toBeTrue()
        ->and($staff->hasRole('admin'))->toBeFalse()
        ->and($admin->hasRole('admin'))->toBeTrue()
        ->and($admin->hasRole('user'))->toBeFalse();
});
