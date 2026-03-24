<?php

namespace App\Support;

use App\Models\User;
use App\Models\UserDocument;
use Illuminate\Support\Arr;
use Illuminate\Support\Str;

class UserDocumentClientDetails
{
    public function extract(UserDocument $userDocument, ?User $fallbackUser = null): array
    {
        $answers = is_array($userDocument->answers_json) ? $userDocument->answers_json : [];

        $name = $this->firstNonEmpty($answers, [
            'client_name',
            'full_name',
            'borrower_name',
            'lender_name',
            'party_name',
            'individual_full_name',
            'name',
        ]);

        $email = $this->firstNonEmpty($answers, [
            'client_email',
            'email',
            'borrower_email',
            'lender_email',
            'party_email',
        ]);

        $address = $this->buildAddress($answers);

        return [
            'name' => $name ?: $fallbackUser?->name,
            'email' => $email ?: $fallbackUser?->email,
            'address' => $address,
        ];
    }

    protected function buildAddress(array $answers): ?string
    {
        $fullAddress = $this->firstNonEmpty($answers, [
            'client_address',
            'address',
            'full_address',
            'registered_address',
            'property_address',
            'borrower_address',
            'lender_address',
            'party_address',
        ]);

        if ($fullAddress) {
            return trim($fullAddress);
        }

        $parts = [];

        foreach (
            [
                'address_line_1',
                'address_line_2',
                'city',
                'province',
                'state',
                'postal_code',
                'zip_code',
                'country',
            ] as $key
        ) {
            $value = Arr::get($answers, $key);

            if (is_string($value) && trim($value) !== '') {
                $parts[] = trim($value);
            }
        }

        if (count($parts) > 0) {
            return implode(', ', $parts);
        }

        return null;
    }

    protected function firstNonEmpty(array $answers, array $keys): ?string
    {
        foreach ($keys as $key) {
            $value = Arr::get($answers, $key);

            if (is_string($value) && trim($value) !== '') {
                return trim($value);
            }
        }

        foreach ($answers as $key => $value) {
            if (! is_string($value) || trim($value) === '') {
                continue;
            }

            $normalized = Str::lower((string) $key);

            foreach ($keys as $candidate) {
                if (Str::contains($normalized, Str::lower($candidate))) {
                    return trim($value);
                }
            }
        }

        return null;
    }
}
