<?php

use App\Support\Money;

test('it formats amounts as naira', function () {
    expect(Money::format(12))->toBe('₦12.00')
        ->and(Money::format('12.00'))->toBe('₦12.00')
        ->and(Money::format(1234.5))->toBe('₦1,234.50')
        ->and(Money::format(0))->toBe('₦0.00');
});
