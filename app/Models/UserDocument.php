<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Storage;

class UserDocument extends Model
{
    public const STATUS_DRAFT = 'draft';
    public const STATUS_GENERATING = 'generating';
    public const STATUS_GENERATED = 'generated';
    public const STATUS_PENDING_REVIEW = 'pending_review';
    public const STATUS_APPROVED = 'approved';
    public const STATUS_CHANGES_REQUESTED = 'changes_requested';
    public const STATUS_REJECTED = 'rejected';
    public const STATUS_READY_TO_SIGN = 'ready_to_sign';
    public const STATUS_COMPLETED = 'completed';

    protected $fillable = [
        'user_id',
        'document_id',
        'document_draft_id',
        'document_draft_item_id',
        'title',
        'reference_number',
        'status',
        'generated_content',
        'file_path',
        'file_original_name',
        'file_mime',
        'file_size',
        'generated_at',
        'submitted_at',
    ];

    protected $casts = [
        'file_size' => 'integer',
        'generated_at' => 'datetime',
        'submitted_at' => 'datetime',
    ];

    protected $appends = [
        'file_url',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function document(): BelongsTo
    {
        return $this->belongsTo(Document::class);
    }

    public function draft(): BelongsTo
    {
        return $this->belongsTo(DocumentDraft::class, 'document_draft_id');
    }

    public function draftItem(): BelongsTo
    {
        return $this->belongsTo(DocumentDraftItem::class, 'document_draft_item_id');
    }

    public function generations(): HasMany
    {
        return $this->hasMany(UserDocumentGeneration::class);
    }

    protected function fileUrl(): Attribute
    {
        return Attribute::make(
            get: function () {
                if (!$this->file_path) {
                    return null;
                }

                return Storage::disk(config('filesystems.default'))->url($this->file_path);
            }
        );
    }
}
