<?php

use Inertia\Testing\AssertableInertia as Assert;

test('returns a successful response', function () {
    $response = $this->get(route('home'));

    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page->component('welcome'));
});

test('the our story page is displayed', function () {
    $this->get(route('our-story'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page->component('our-story'));
});
