<?php

namespace App\Enums;

enum SalesPeriod: string
{
    case Weekly = 'weekly';
    case Monthly = 'monthly';
    case Quarterly = 'quarterly';
    case Yearly = 'yearly';

    public function label(): string
    {
        return match ($this) {
            self::Weekly => 'Last 7 days',
            self::Monthly => 'Last 12 months',
            self::Quarterly => 'Last 4 quarters',
            self::Yearly => 'Last 5 years',
        };
    }
}
