<?php

namespace App\Enums;

enum DocumentType: string
{
    case LOAN_AGREEMENT = 'loan_agreement';
    case NDA = 'nda';

    /**
     * @return array<int, string>
     */
    public static function values(): array
    {
        return array_map(
            static fn(self $type) => $type->value,
            self::cases()
        );
    }

    /**
     * @return array<int, array{value: string, label: string}>
     */
    public static function options(): array
    {
        return array_map(
            static fn(self $type) => [
                'value' => $type->value,
                'label' => str($type->value)->replace('_', ' ')->title()->toString(),
            ],
            self::cases()
        );
    }
}
