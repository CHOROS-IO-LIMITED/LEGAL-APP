<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class UserDocument extends Model
{
    use HasFactory;

    public const STATUS_SELECTED = 'selected';
    public const STATUS_KYC_PENDING = 'kyc_pending';
    public const STATUS_KYC_COMPLETED = 'kyc_completed';
    public const STATUS_CHECKOUT_PENDING = 'checkout_pending';
    public const STATUS_CHECKOUT_COMPLETED = 'checkout_completed';
    public const STATUS_VERIFICATION_PENDING = 'verification_pending';
    public const STATUS_VERIFICATION_COMPLETED = 'verification_completed';
    public const STATUS_QNA_PENDING = 'qna_pending';
    public const STATUS_QNA_COMPLETED = 'qna_completed';
    public const STATUS_PDF_GENERATED = 'pdf_generated';

    public const STATUS_PENDING_APPROVAL = 'pending_approval';
    public const STATUS_SIGNATURE = 'signature';
    public const STATUS_REJECTED = 'rejected';
    public const STATUS_COMPLETED = 'completed';
    public const STATUS_CANCELLED = 'cancelled';

    public const DASHBOARD_STATUS_DRAFT = 'draft';
    public const DASHBOARD_STATUS_PENDING_APPROVAL = 'pending_approval';
    public const DASHBOARD_STATUS_SIGNATURE = 'signature';
    public const DASHBOARD_STATUS_REJECTED = 'rejected';
    public const DASHBOARD_STATUS_COMPLETED = 'completed';

    protected $fillable = [
        'user_id',
        'document_id',
        'batch_uuid',
        'status',
        'price',
        'question_schema_json',
        'answers_json',
        'client_note',
        'lawyer_note',
        'signature_recipients_json',
        'docusign_client_name',
        'docusign_client_email',
        'signature_provider',
        'signature_envelope_id',
        'signature_status',
        'generated_pdf_path',
        'generated_pdf_original_name',
        'generated_pdf_mime',
        'generated_pdf_size',
        'signed_pdf_path',
        'signed_pdf_original_name',
        'signed_pdf_mime',
        'signed_pdf_size',
        'submitted_for_approval_at',
        'qna_completed_at',
        'pdf_generated_at',
        'approved_for_signature_at',
        'sent_for_signature_at',
        'rejected_at',
        'completed_at',
        'signature_completed_at',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'question_schema_json' => 'array',
        'answers_json' => 'array',
        'signature_recipients_json' => 'array',
        'generated_pdf_size' => 'integer',
        'signed_pdf_size' => 'integer',
        'submitted_for_approval_at' => 'datetime',
        'qna_completed_at' => 'datetime',
        'pdf_generated_at' => 'datetime',
        'approved_for_signature_at' => 'datetime',
        'sent_for_signature_at' => 'datetime',
        'rejected_at' => 'datetime',
        'completed_at' => 'datetime',
        'signature_completed_at' => 'datetime',
    ];

    protected $appends = [
        'generated_pdf_url',
        'signed_pdf_url',
        'current_pdf_url',
        'dashboard_status',
        'client_name',
        'client_email',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function document(): BelongsTo
    {
        return $this->belongsTo(Document::class);
    }

    public function scopeOwnedBy(Builder $query, int $userId): Builder
    {
        return $query->where('user_id', $userId);
    }

    public function scopeBatch(Builder $query, string $batchUuid): Builder
    {
        return $query->where('batch_uuid', $batchUuid);
    }

    public function scopeForDashboard(Builder $query): Builder
    {
        return $query->whereIn('status', [
            self::STATUS_PDF_GENERATED,
            self::STATUS_PENDING_APPROVAL,
            self::STATUS_SIGNATURE,
            self::STATUS_REJECTED,
            self::STATUS_COMPLETED,
        ]);
    }

    public function scopeForAdminDashboard(Builder $query): Builder
    {
        return $query->whereIn('status', [
            self::STATUS_PENDING_APPROVAL,
            self::STATUS_SIGNATURE,
            self::STATUS_REJECTED,
            self::STATUS_COMPLETED,
        ]);
    }

    protected function generatedPdfUrl(): Attribute
    {
        return Attribute::make(
            get: function () {
                if (! $this->generated_pdf_path) {
                    return null;
                }

                return Storage::disk(config('filesystems.default'))->url($this->generated_pdf_path);
            }
        );
    }

    protected function signedPdfUrl(): Attribute
    {
        return Attribute::make(
            get: function () {
                if (! $this->signed_pdf_path) {
                    return null;
                }

                return Storage::disk(config('filesystems.default'))->url($this->signed_pdf_path);
            }
        );
    }

    protected function currentPdfUrl(): Attribute
    {
        return Attribute::make(
            get: fn() => $this->signed_pdf_url ?: $this->generated_pdf_url
        );
    }

    protected function dashboardStatus(): Attribute
    {
        return Attribute::make(
            get: fn() => match ($this->status) {
                self::STATUS_PENDING_APPROVAL => self::DASHBOARD_STATUS_PENDING_APPROVAL,
                self::STATUS_SIGNATURE => self::DASHBOARD_STATUS_SIGNATURE,
                self::STATUS_REJECTED => self::DASHBOARD_STATUS_REJECTED,
                self::STATUS_COMPLETED => self::DASHBOARD_STATUS_COMPLETED,
                self::STATUS_PDF_GENERATED => self::DASHBOARD_STATUS_DRAFT,
                default => self::DASHBOARD_STATUS_DRAFT,
            }
        );
    }

    protected function clientName(): Attribute
    {
        return Attribute::make(
            get: fn() => $this->docusign_client_name ?: $this->user?->name
        );
    }

    protected function clientEmail(): Attribute
    {
        return Attribute::make(
            get: fn() => $this->docusign_client_email ?: $this->user?->email
        );
    }

    public function canBeSubmittedForApproval(): bool
    {
        return in_array($this->status, [
            self::STATUS_PDF_GENERATED,
            self::STATUS_REJECTED,
        ], true) && ! empty($this->generated_pdf_path);
    }

    public function canBeReturnedToQuestions(): bool
    {
        return in_array($this->status, [
            self::STATUS_PDF_GENERATED,
            self::STATUS_REJECTED,
        ], true);
    }

    public function canBeDownloaded(): bool
    {
        return ! empty($this->signed_pdf_path) || ! empty($this->generated_pdf_path);
    }

    public function canBeApprovedByLawyer(): bool
    {
        return $this->status === self::STATUS_PENDING_APPROVAL
            && ! empty($this->generated_pdf_path);
    }

    public function canBeRejectedByLawyer(): bool
    {
        return $this->status === self::STATUS_PENDING_APPROVAL;
    }

    public function canBeSignedByUser(User $user): bool
    {
        if ($this->status !== self::STATUS_SIGNATURE) {
            return false;
        }

        if (! $this->signature_envelope_id) {
            return false;
        }

        if ($user->id !== $this->user_id) {
            return false;
        }

        $recipient = $this->findRecipientForEmail($user->email);

        if (! $recipient) {
            return false;
        }

        return ! empty($recipient['recipient_id']);
    }

    public function findRecipientForEmail(?string $email): ?array
    {
        $needle = Str::lower(trim((string) $email));

        if ($needle === '') {
            return null;
        }

        $recipients = is_array($this->signature_recipients_json) ? $this->signature_recipients_json : [];

        foreach ($recipients as $recipient) {
            $recipientEmail = Str::lower(trim((string) ($recipient['email'] ?? '')));

            if ($recipientEmail === $needle) {
                return $recipient;
            }
        }

        return null;
    }

    public function currentPdfPath(): ?string
    {
        return $this->signed_pdf_path ?: $this->generated_pdf_path;
    }

    public function currentPdfOriginalName(): string
    {
        return $this->signed_pdf_original_name
            ?: $this->generated_pdf_original_name
            ?: 'document.pdf';
    }
}
