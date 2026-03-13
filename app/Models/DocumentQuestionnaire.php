<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class DocumentQuestionnaire extends Model
{
    public const STATUS_PENDING = 'pending';
    public const STATUS_GENERATED = 'generated';
    public const STATUS_ANSWERED = 'answered';

    protected $fillable = [
        'document_draft_item_id',
        'status',
        'version',
        'schema',
        'generated_at',
    ];

    protected $casts = [
        'schema' => 'array',
        'generated_at' => 'datetime',
    ];

    public function draftItem(): BelongsTo
    {
        return $this->belongsTo(DocumentDraftItem::class, 'document_draft_item_id');
    }

    public function answers(): HasMany
    {
        return $this->hasMany(DocumentQuestionnaireAnswer::class);
    }

    public function generations(): HasMany
    {
        return $this->hasMany(UserDocumentGeneration::class, 'document_questionnaire_id');
    }
}
