<?php

namespace App\Services\DocuSign;

use App\Models\UserDocument;
use Illuminate\Http\Client\PendingRequest;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
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

        $response = $this->api()
            ->post($this->accountApiPath('/envelopes'), $payload)
            ->throw()
            ->json();

        return $response;
    }

    public function createSenderView(string $envelopeId, string $returnUrl): string
    {
        $payload = [
            'returnUrl' => $returnUrl,
        ];

        $response = $this->api()
            ->post($this->accountApiPath("/envelopes/{$envelopeId}/views/sender"), $payload)
            ->throw()
            ->json();

        $url = (string) ($response['url'] ?? '');

        if ($url === '') {
            throw new RuntimeException('DocuSign sender view URL was not returned.');
        }

        return $url;
    }

    public function getEnvelope(string $envelopeId): array
    {
        return $this->api()
            ->get($this->accountApiPath("/envelopes/{$envelopeId}"))
            ->throw()
            ->json();
    }

    public function listRecipients(string $envelopeId): array
    {
        return $this->api()
            ->get($this->accountApiPath("/envelopes/{$envelopeId}/recipients"))
            ->throw()
            ->json();
    }

    public function downloadCombinedDocuments(string $envelopeId): string
    {
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

        $ownerEmail = strtolower(trim((string) $userDocument->user?->email));
        $signers = [];

        foreach (array_values($recipients) as $index => $recipient) {
            $name = trim((string) ($recipient['name'] ?? ''));
            $email = trim((string) ($recipient['email'] ?? ''));

            if ($name === '' || $email === '') {
                continue;
            }

            $recipientId = (string) ($index + 1);
            $isOwner = $ownerEmail !== '' && strtolower($email) === $ownerEmail;

            $signer = [
                'name' => $name,
                'email' => $email,
                'recipientId' => $recipientId,
                'routingOrder' => (string) ($recipient['routing_order'] ?? ($index + 1)),
            ];

            if ($isOwner) {
                $signer['clientUserId'] = $recipientId;
                $signer['embeddedRecipientStartURL'] = 'SIGN_AT_DOCUSIGN';
            }

            $signers[] = $signer;
        }

        return $signers;
    }

    public function createRecipientView(
        string $envelopeId,
        array $recipient,
        string $returnUrl,
        string $clientUserId
    ): string {
        $name = trim((string) ($recipient['name'] ?? ''));
        $email = trim((string) ($recipient['email'] ?? ''));
        $recipientId = (string) ($recipient['recipient_id'] ?? $recipient['recipientId'] ?? '');
        $routingOrder = (string) ($recipient['routing_order'] ?? $recipient['routingOrder'] ?? '');

        if ($name === '' || $email === '' || $recipientId === '') {
            throw new RuntimeException('Recipient data is incomplete for embedded signing.');
        }

        $payload = [
            'returnUrl' => $returnUrl,
            'authenticationMethod' => 'none',
            'email' => $email,
            'userName' => $name,
            'recipientId' => $recipientId,
            'clientUserId' => $clientUserId,
        ];

        if ($routingOrder !== '') {
            $payload['routingOrder'] = $routingOrder;
        }

        $response = $this->api()
            ->post($this->accountApiPath("/envelopes/{$envelopeId}/views/recipient"), $payload)
            ->throw()
            ->json();

        $url = (string) ($response['url'] ?? '');

        if ($url === '') {
            throw new RuntimeException('DocuSign recipient signing URL was not returned.');
        }

        return $url;
    }
}
