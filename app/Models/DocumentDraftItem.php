<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class DocumentDraftItem extends Model
{
    public const STATUS_PENDING = 'pending';
    public const STATUS_QUESTIONNAIRE_PENDING = 'questionnaire_pending';
    public const STATUS_QUESTIONNAIRE_READY = 'questionnaire_ready';
    public const STATUS_ANSWERED = 'answered';
    public const STATUS_GENERATED = 'generated';
    public const STATUS_FAILED = 'failed';

    protected $fillable = [
        'document_draft_id',
        'document_id',
        'quantity',
        'unit_price',
        'total_price',
        'status',
    ];

    protected $casts = [
        'quantity' => 'integer',
        'unit_price' => 'decimal:2',
        'total_price' => 'decimal:2',
    ];

    public function draft(): BelongsTo
    {
        return $this->belongsTo(DocumentDraft::class, 'document_draft_id');
    }

    public function document(): BelongsTo
    {
        return $this->belongsTo(Document::class);
    }

    public function questionnaire(): HasOne
    {
        return $this->hasOne(DocumentQuestionnaire::class);
    }

    public function userDocuments(): HasMany
    {
        return $this->hasMany(UserDocument::class);
    }
}
