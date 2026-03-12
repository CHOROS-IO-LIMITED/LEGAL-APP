<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Support\Facades\Storage;

class Document extends Model
{
    protected $fillable = [
        'user_id',
        'title',
        'slug',
        'image_path',
        'image_original_name',
        'image_mime',
        'image_size',
        'document_path',
        'document_original_name',
        'document_mime',
        'document_size',
        'price',
        'description',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'image_size' => 'integer',
        'document_size' => 'integer',
    ];

    protected $appends = [
        'image_url',
        'document_url',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    protected function imageUrl(): Attribute
    {
        return Attribute::make(
            get: fn() => $this->image_path ? Storage::disk('public')->path($this->image_path) : null
        );
    }

    protected function documentUrl(): Attribute
    {
        return Attribute::make(
            get: fn() => $this->document_path ? Storage::disk('public')->path($this->document_path) : null
        );
    }
}
