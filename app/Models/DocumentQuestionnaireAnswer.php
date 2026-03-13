<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DocumentQuestionnaireAnswer extends Model
{
    protected $fillable = [
        'document_questionnaire_id',
        'question_key',
        'question_label',
        'answer',
        'meta',
    ];

    protected $casts = [
        'meta' => 'array',
    ];

    public function questionnaire(): BelongsTo
    {
        return $this->belongsTo(DocumentQuestionnaire::class, 'document_questionnaire_id');
    }
}
