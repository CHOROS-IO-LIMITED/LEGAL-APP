<?php

namespace App\Support\Documents\LoanAgreement;

final class NormalizedAnswerMerger
{
    /**
     * @param array<string, mixed> $original
     * @param array<string, mixed> $normalized
     * @return array<string, mixed>
     */
    public function merge(array $original, array $normalized): array
    {
        $merged = $original;

        foreach ($normalized as $key => $value) {
            if (! is_string($key) || $key === '') {
                continue;
            }

            $merged[$key] = $value;
        }

        return $merged;
    }
}
