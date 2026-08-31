<?php

namespace App\Enums;

enum UserAudience: string
{
    case Customers = 'customers';
    case Staff = 'staff';
    case Admins = 'admins';

    public function label(): string
    {
        return match ($this) {
            self::Customers => 'Customers',
            self::Staff => 'Staff',
            self::Admins => 'Admins',
        };
    }

    public function description(): string
    {
        return match ($this) {
            self::Customers => 'People with a customer account. They can register businesses and place orders.',
            self::Staff => 'Team members who help run the bakery.',
            self::Admins => 'Administrators who manage the catalog, businesses, and orders.',
        };
    }

    /**
     * @return list<string>
     */
    public function roleNames(): array
    {
        return match ($this) {
            self::Customers => ['user'],
            self::Staff => ['staff'],
            self::Admins => ['admin', 'super_admin'],
        };
    }

    public function emptyTitle(): string
    {
        return match ($this) {
            self::Customers => 'No customers yet',
            self::Staff => 'No staff yet',
            self::Admins => 'No admins yet',
        };
    }

    public function emptyDescription(): string
    {
        return match ($this) {
            self::Customers => 'Customer accounts will appear here when people register.',
            self::Staff => 'Staff accounts will appear here when they are added.',
            self::Admins => 'Admin accounts will appear here when they are added.',
        };
    }
}
