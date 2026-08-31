<?php

use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('guests are redirected from help and support', function () {
    $this->get(route('help'))
        ->assertRedirect(route('login'));
});

test('guests are redirected from faqs', function () {
    $this->get(route('faqs'))
        ->assertRedirect(route('login'));
});

test('authenticated users can visit help and support', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get(route('help'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page->component('help'));
});

test('authenticated users can visit faqs', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get(route('faqs'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page->component('faqs'));
});
