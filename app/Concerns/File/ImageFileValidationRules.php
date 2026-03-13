<?php

namespace App\Concerns\File;

use Illuminate\Validation\Rules\File;

class ImageFileValidationRules
{
    public static function make(bool $required = false): array
    {
        $base = [
            File::image()
                ->types(['jpg', 'jpeg', 'png', 'webp'])
                ->max(5 * 1024),
        ];

        return $required
            ? array_merge(['required'], $base)
            : array_merge(['nullable'], $base);
    }
}
