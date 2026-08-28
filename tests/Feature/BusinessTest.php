<?php

use App\Enums\BusinessStatus;
use App\Models\Business;
use App\Models\User;

test('a pending business can be created with only a creator and then approved', function () {
    $creator = User::factory()->create();
    $approver = User::factory()->create();

    $business = Business::factory()->create([
        'created_by' => $creator->id,
    ]);

    expect($business->status)->toBe(BusinessStatus::Pending)
        ->and($business->created_by)->toBe($creator->id)
        ->and($business->approved_by)->toBeNull()
        ->and($business->approved_at)->toBeNull()
        ->and($business->updated_by)->toBeNull()
        ->and($business->createdBy->is($creator))->toBeTrue();

    expect($creator->businesses)->toHaveCount(1)
        ->and($creator->businesses->first()->is($business))->toBeTrue();

    $business->status = BusinessStatus::Approved;
    $business->approvedBy()->associate($approver);
    $business->approved_at = now();
    $business->save();

    $business->refresh();

    expect($business->status)->toBe(BusinessStatus::Approved)
        ->and($business->approved_by)->toBe($approver->id)
        ->and($business->approved_at)->not->toBeNull()
        ->and($business->approvedBy->is($approver))->toBeTrue();
});
