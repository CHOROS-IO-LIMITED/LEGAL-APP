<?php

namespace App\Services\Ai;

use RuntimeException;

class DocumentTextExtractor
{
    public function __construct(
        protected WordTextExtractor $wordTextExtractor,
        protected PdfTextExtractor $pdfTextExtractor,
    ) {}

    public function extract(string $path): string
    {
        $extension = strtolower(pathinfo($path, PATHINFO_EXTENSION));

        return match ($extension) {
            'doc', 'docx' => $this->wordTextExtractor->extract($path),
            'pdf' => $this->pdfTextExtractor->extract($path),
            default => throw new RuntimeException("Unsupported document file type: {$extension}"),
        };
    }
}
