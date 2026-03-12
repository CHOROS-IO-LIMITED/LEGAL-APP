<?php

namespace App\Concerns\File;

use Illuminate\Validation\Rules\File;

class DocumentFileValidationRules
{
    public static function make(bool $required = false): array
    {
        $base = [
            File::types(['pdf'])
                ->max(10 * 1024),
        ];

        return $required
            ? array_merge(['required'], $base)
            : array_merge(['nullable'], $base);
    }
}
