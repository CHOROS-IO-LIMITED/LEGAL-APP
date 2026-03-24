<?php

namespace App\Services\Ai;

use Illuminate\Http\Client\ConnectionException;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use RuntimeException;

class GeminiFileUploader
{
    protected string $baseUrl = 'https://generativelanguage.googleapis.com';

    public function upload(string $path, string $displayName = 'document'): array
    {
        if (! is_file($path)) {
            throw new RuntimeException("File not found: {$path}");
        }

        $cacheKey = 'gemini_uploaded_file_' . md5($path . '|' . @filemtime($path) . '|' . @filesize($path));

        return Cache::remember($cacheKey, now()->addHours(12), function () use ($path, $displayName) {
            $apiKey = config('services.gemini.api_key');

            if (! $apiKey) {
                throw new RuntimeException('Gemini API key is not configured.');
            }

            $mimeType = mime_content_type($path) ?: 'application/pdf';
            $numBytes = filesize($path);

            $start = Http::withHeaders([
                'X-Goog-Upload-Protocol' => 'resumable',
                'X-Goog-Upload-Command' => 'start',
                'X-Goog-Upload-Header-Content-Length' => (string) $numBytes,
                'X-Goog-Upload-Header-Content-Type' => $mimeType,
                'Content-Type' => 'application/json',
            ])->withBody(json_encode([
                'file' => [
                    'display_name' => $displayName,
                ],
            ]), 'application/json')->send('POST', "{$this->baseUrl}/upload/v1beta/files?key={$apiKey}");

            if (! $start->successful()) {
                Log::error('Gemini file upload start failed', [
                    'status' => $start->status(),
                    'body' => $start->body(),
                ]);

                throw new RuntimeException('Failed to start Gemini file upload.');
            }

            $uploadUrl = $start->header('X-Goog-Upload-URL');

            if (! $uploadUrl) {
                throw new RuntimeException('Gemini upload URL missing.');
            }

            try {
                $final = Http::withHeaders([
                    'Content-Length' => (string) $numBytes,
                    'X-Goog-Upload-Offset' => '0',
                    'X-Goog-Upload-Command' => 'upload, finalize',
                ])->withBody(file_get_contents($path), $mimeType)->send('POST', $uploadUrl);
            } catch (ConnectionException $e) {
                throw new RuntimeException('Gemini file upload failed: ' . $e->getMessage(), 0, $e);
            }

            if (! $final->successful()) {
                Log::error('Gemini file upload finalize failed', [
                    'status' => $final->status(),
                    'body' => $final->body(),
                ]);

                throw new RuntimeException('Failed to finalize Gemini file upload.');
            }

            $json = $final->json();

            return [
                'name' => data_get($json, 'file.name'),
                'uri' => data_get($json, 'file.uri'),
                'mime_type' => data_get($json, 'file.mime_type', $mimeType),
            ];
        });
    }
}
