<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserDocumentGeneration extends Model
{
    public const STATUS_QUEUED = 'queued';
    public const STATUS_SUCCESS = 'success';
    public const STATUS_FAILED = 'failed';

    protected $fillable = [
        'user_document_id',
        'document_questionnaire_id',
        'provider',
        'model',
        'prompt',
        'response',
        'input_payload',
        'output_payload',
        'status',
        'error_message',
        'generated_at',
    ];

    protected $casts = [
        'input_payload' => 'array',
        'output_payload' => 'array',
        'generated_at' => 'datetime',
    ];

    public function userDocument(): BelongsTo
    {
        return $this->belongsTo(UserDocument::class);
    }

    public function questionnaire(): BelongsTo
    {
        return $this->belongsTo(DocumentQuestionnaire::class, 'document_questionnaire_id');
    }
}
