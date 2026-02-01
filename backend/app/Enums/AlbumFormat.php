<?php

namespace App\Enums;

enum AlbumFormat: string
{
    case VINYL = 'vinyl';
    case CD = 'cd';
    case CASSETTE = 'cassette';
    case DIGITAL = 'digital';

    public function label(): string
    {
        return match($this) {
            self::VINYL => 'Vinyl LP',
            self::CD => 'CD',
            self::CASSETTE => 'Cassette',
            self::DIGITAL => 'Digital Download',
        };
    }

    public function requiresShipping(): bool
    {
        return $this !== self::DIGITAL;
    }
}
