<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

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
    public const STATUS_COMPLETED = 'completed';
    public const STATUS_CANCELLED = 'cancelled';

    protected $fillable = [
        'user_id',
        'document_id',
        'batch_uuid',
        'status',
        'price',
        'question_schema_json',
        'answers_json',
        'generated_pdf_path',
        'generated_pdf_original_name',
        'generated_pdf_mime',
        'generated_pdf_size',
        'generated_docx_path',
        'generated_docx_original_name',
        'generated_docx_mime',
        'generated_docx_size',
        'qna_completed_at',
        'pdf_generated_at',
        'completed_at',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'question_schema_json' => 'array',
        'answers_json' => 'array',
        'generated_pdf_size' => 'integer',
        'qna_completed_at' => 'datetime',
        'pdf_generated_at' => 'datetime',
        'docx_generated_at' => 'datetime',
        'completed_at' => 'datetime',
    ];

    protected $appends = [
        'generated_pdf_url',
        'generated_docx_url',
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

    protected function generatedDocxUrl(): Attribute
    {
        return Attribute::make(
            get: fn() => $this->generated_docx_path
                ? Storage::disk(config('filesystems.default', 'public'))->url($this->generated_docx_path)
                : null
        );
    }
}
