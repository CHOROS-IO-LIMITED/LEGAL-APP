<?php

namespace App\Services\DocuSign;

use App\Models\UserDocument;
use Illuminate\Http\Client\PendingRequest;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use RuntimeException;

class DocuSignService
{
    public function accessToken(): string
    {
        $token = (string) config('services.docusign.access_token');

        if ($token === '') {
            throw new RuntimeException('DocuSign access token is not configured.');
        }

        return $token;
    }

    public function accountId(): string
    {
        $accountId = (string) config('services.docusign.account_id');

        if ($accountId === '') {
            throw new RuntimeException('DocuSign account id is not configured.');
        }

        return $accountId;
    }

    protected function oauthBaseUri(): string
    {
        return rtrim((string) config('services.docusign.oauth_base_uri'), '/');
    }

    public function restBaseUri(): string
    {
        return Cache::remember('docusign.rest_base_uri.' . $this->accountId(), now()->addMinutes(30), function () {
            $response = Http::withToken($this->accessToken())
                ->acceptJson()
                ->get($this->oauthBaseUri() . '/oauth/userinfo')
                ->throw()
                ->json();

            $accounts = Arr::get($response, 'accounts', []);
            $account = collect($accounts)->firstWhere('account_id', $this->accountId());

            if (! $account) {
                $account = collect($accounts)->first();
            }

            $baseUri = (string) Arr::get($account, 'base_uri', '');

            if ($baseUri === '') {
                $fallback = rtrim((string) config('services.docusign.base_uri'), '/');

                if ($fallback === '') {
                    throw new RuntimeException('Unable to resolve DocuSign REST base URI.');
                }

                return $fallback;
            }

            return $baseUri;
        });
    }

    protected function api(): PendingRequest
    {
        return Http::withToken($this->accessToken())
            ->acceptJson()
            ->contentType('application/json');
    }

    protected function accountApiPath(string $path): string
    {
        return sprintf(
            '%s/restapi/v2.1/accounts/%s%s',
            $this->restBaseUri(),
            $this->accountId(),
            $path
        );
    }

    public function createDraftEnvelope(UserDocument $userDocument): array
    {
        if (! $userDocument->generated_pdf_path) {
            throw new RuntimeException('Generated PDF path is missing.');
        }

        $disk = config('filesystems.default');
        $storage = Storage::disk($disk);

        if (! $storage->exists($userDocument->generated_pdf_path)) {
            throw new RuntimeException('Generated PDF file does not exist.');
        }

        $pdfBinary = $storage->get($userDocument->generated_pdf_path);
        $recipients = $this->buildSigners($userDocument);

        if (count($recipients) === 0) {
            throw new RuntimeException('At least one signature recipient is required.');
        }

        $payload = [
            'emailSubject' => 'Please review and sign: ' . ($userDocument->document?->title ?? 'Document'),
            'status' => 'created',
            'documents' => [[
                'documentBase64' => base64_encode($pdfBinary),
                'name' => $userDocument->generated_pdf_original_name ?: 'document.pdf',
                'fileExtension' => 'pdf',
                'documentId' => '1',
            ]],
            'recipients' => [
                'signers' => $recipients,
            ],
        ];

        Log::info('DocuSign create envelope request.', [
            'user_document_id' => $userDocument->id,
            'document_title' => $userDocument->document?->title,
            'generated_pdf_path' => $userDocument->generated_pdf_path,
            'generated_pdf_original_name' => $userDocument->generated_pdf_original_name,
            'recipient_count' => count($recipients),
            'recipients' => $recipients,
            'email_subject' => $payload['emailSubject'],
        ]);

        $response = $this->api()
            ->post($this->accountApiPath('/envelopes'), $payload)
            ->throw()
            ->json();

        Log::info('DocuSign create envelope response.', [
            'user_document_id' => $userDocument->id,
            'envelope_id' => $response['envelopeId'] ?? null,
            'status' => $response['status'] ?? null,
            'uri' => $response['uri'] ?? null,
        ]);

        return $response;
    }

    public function createSenderView(string $envelopeId, string $returnUrl): string
    {
        $payload = [
            'returnUrl' => $returnUrl,
        ];

        Log::info('DocuSign create sender view request.', [
            'envelope_id' => $envelopeId,
            'return_url' => $returnUrl,
        ]);

        $response = $this->api()
            ->post($this->accountApiPath("/envelopes/{$envelopeId}/views/sender"), $payload)
            ->throw()
            ->json();

        $url = (string) ($response['url'] ?? '');

        Log::info('DocuSign create sender view response.', [
            'envelope_id' => $envelopeId,
            'has_url' => $url !== '',
        ]);

        if ($url === '') {
            throw new RuntimeException('DocuSign sender view URL was not returned.');
        }

        return $url;
    }

    public function getEnvelope(string $envelopeId): array
    {
        $response = $this->api()
            ->get($this->accountApiPath("/envelopes/{$envelopeId}"))
            ->throw()
            ->json();

        Log::info('DocuSign get envelope response.', [
            'envelope_id' => $envelopeId,
            'status' => $response['status'] ?? null,
            'email_subject' => $response['emailSubject'] ?? null,
            'sent_date_time' => $response['sentDateTime'] ?? null,
            'completed_date_time' => $response['completedDateTime'] ?? null,
        ]);

        return $response;
    }

    public function listRecipients(string $envelopeId): array
    {
        $response = $this->api()
            ->get($this->accountApiPath("/envelopes/{$envelopeId}/recipients"))
            ->throw()
            ->json();

        Log::info('DocuSign list recipients response.', [
            'envelope_id' => $envelopeId,
            'recipient_count' => $response['recipientCount'] ?? null,
            'current_routing_order' => $response['currentRoutingOrder'] ?? null,
            'signers' => collect($response['signers'] ?? [])->map(function (array $signer) {
                return [
                    'name' => $signer['name'] ?? null,
                    'email' => $signer['email'] ?? null,
                    'recipient_id' => $signer['recipientId'] ?? null,
                    'routing_order' => $signer['routingOrder'] ?? null,
                    'status' => $signer['status'] ?? null,
                    'delivery_method' => $signer['deliveryMethod'] ?? null,
                    'sent_date_time' => $signer['sentDateTime'] ?? null,
                    'delivered_date_time' => $signer['deliveredDateTime'] ?? null,
                    'completed_date_time' => $signer['completedDateTime'] ?? null,
                ];
            })->values()->all(),
        ]);

        return $response;
    }

    public function downloadCombinedDocuments(string $envelopeId): string
    {
        Log::info('DocuSign download combined document request.', [
            'envelope_id' => $envelopeId,
        ]);

        return $this->api()
            ->get($this->accountApiPath("/envelopes/{$envelopeId}/documents/combined"))
            ->throw()
            ->body();
    }

    protected function buildSigners(UserDocument $userDocument): array
    {
        $recipients = $userDocument->signature_recipients_json ?? [];

        if (! is_array($recipients) || $recipients === []) {
            $fallbackName = $userDocument->client_name;
            $fallbackEmail = $userDocument->client_email;

            if ($fallbackName && $fallbackEmail) {
                $recipients = [[
                    'name' => $fallbackName,
                    'email' => $fallbackEmail,
                    'role' => 'Client',
                    'routing_order' => 1,
                ]];
            }
        }

        $signers = [];

        foreach (array_values($recipients) as $index => $recipient) {
            $name = trim((string) ($recipient['name'] ?? ''));
            $email = trim((string) ($recipient['email'] ?? ''));

            if ($name === '' || $email === '') {
                Log::warning('DocuSign skipped invalid signer.', [
                    'user_document_id' => $userDocument->id,
                    'index' => $index,
                    'recipient' => $recipient,
                ]);

                continue;
            }

            $signers[] = [
                'name' => $name,
                'email' => $email,
                'recipientId' => (string) ($index + 1),
                'routingOrder' => (string) ($recipient['routing_order'] ?? ($index + 1)),
            ];
        }

        Log::info('DocuSign build signers result.', [
            'user_document_id' => $userDocument->id,
            'signers' => $signers,
        ]);

        return $signers;
    }
}
