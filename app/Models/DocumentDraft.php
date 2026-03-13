<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class DocumentDraft extends Model
{
    public const STATUS_DRAFT = 'draft';
    public const STATUS_COLLECTING_ANSWERS = 'collecting_answers';
    public const STATUS_READY_FOR_CHECKOUT = 'ready_for_checkout';
    public const STATUS_AWAITING_VERIFICATION = 'awaiting_verification';
    public const STATUS_PROCESSING = 'processing';
    public const STATUS_COMPLETED = 'completed';
    public const STATUS_CANCELLED = 'cancelled';
    public const STATUS_EXPIRED = 'expired';

    protected $fillable = [
        'user_id',
        'status',
        'current_step',
        'subtotal',
        'started_at',
        'last_activity_at',
        'completed_at',
        'expires_at',
    ];

    protected $casts = [
        'current_step' => 'integer',
        'subtotal' => 'decimal:2',
        'started_at' => 'datetime',
        'last_activity_at' => 'datetime',
        'completed_at' => 'datetime',
        'expires_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(DocumentDraftItem::class);
    }

    public function userDocuments(): HasMany
    {
        return $this->hasMany(UserDocument::class);
    }
}
