<?php

namespace App\Services\Ai;

use Illuminate\Support\Facades\Log;
use RuntimeException;
use Smalot\PdfParser\Parser;
use Symfony\Component\Process\Process;

class PdfTextExtractor
{
    public function extract(string $path): string
    {
        if (! is_file($path)) {
            throw new RuntimeException("PDF file not found: {$path}");
        }

        $text = $this->extractWithPdftotext($path);

        if ($this->isUsefulText($text)) {
            return $this->cleanText($text);
        }

        $text = $this->extractWithPhpParser($path);

        if ($this->isUsefulText($text)) {
            return $this->cleanText($text);
        }

        throw new RuntimeException("Unable to extract useful text from PDF: {$path}");
    }

    protected function extractWithPdftotext(string $path): string
    {
        try {
            $process = new Process([
                'pdftotext',
                '-layout',
                '-enc',
                'UTF-8',
                $path,
                '-',
            ]);

            $process->setTimeout(30);
            $process->run();

            if (! $process->isSuccessful()) {
                Log::warning('pdftotext failed', [
                    'path' => $path,
                    'error' => $process->getErrorOutput(),
                ]);

                return '';
            }

            return (string) $process->getOutput();
        } catch (\Throwable $e) {
            Log::warning('pdftotext unavailable', [
                'path' => $path,
                'message' => $e->getMessage(),
            ]);

            return '';
        }
    }

    protected function extractWithPhpParser(string $path): string
    {
        try {
            if (! class_exists(Parser::class)) {
                return '';
            }

            $parser = new Parser();
            $pdf = $parser->parseFile($path);

            return (string) $pdf->getText();
        } catch (\Throwable $e) {
            Log::warning('PHP PDF parser failed', [
                'path' => $path,
                'message' => $e->getMessage(),
            ]);

            return '';
        }
    }

    protected function isUsefulText(string $text): bool
    {
        $text = trim($text);

        if ($text === '') {
            return false;
        }

        $alphaNumCount = preg_match_all('/[A-Za-z0-9]/', $text);

        return $alphaNumCount >= 50;
    }

    protected function cleanText(string $text): string
    {
        $text = str_replace(["\r\n", "\r"], "\n", $text);
        $text = preg_replace('/[ \t]+/', ' ', $text) ?? $text;
        $text = preg_replace('/\n{3,}/', "\n\n", $text) ?? $text;

        return trim($text);
    }
}
