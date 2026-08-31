<?php

namespace App\Support;

use Illuminate\Support\Number;

class Money
{
    public static function format(int|float|string $amount): string
    {
        return Number::currency((float) $amount, in: 'NGN', locale: 'en_NG');
    }
}
