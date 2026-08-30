<?php

namespace App\Enums;

enum OrderStatus: string
{
    case Pending = 'pending';
    case ReadyForPickup = 'ready_for_pickup';
    case Completed = 'completed';
    case Cancelled = 'cancelled';
}
