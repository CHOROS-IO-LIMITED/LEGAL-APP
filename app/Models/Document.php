<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Support\Facades\Storage;


class Document extends Model
{
    protected $fillable = [
        'user_id',
        'document_type',
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
        'default_question_schema_json',
        'template_schema_json',
        'price',
        'description',
        'short_description',
        'is_active',
        'is_featured',
        'sort_order',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'image_size' => 'integer',
        'document_size' => 'integer',
        'default_question_schema_json' => 'array',
        'template_schema_json' => 'array',
        'is_active' => 'boolean',
        'is_featured' => 'boolean',
        'sort_order' => 'integer',
    ];

    protected $appends = [
        'image_url',
        'document_url',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true);
    }

    public function scopeOrdered(Builder $query): Builder
    {
        return $query->orderBy('sort_order')->orderBy('title');
    }

    public function userDocuments(): HasMany
    {
        return $this->hasMany(UserDocument::class);
    }

    protected function imageUrl(): Attribute
    {
        return Attribute::make(
            get: fn() => $this->image_path
                ? Storage::disk(config('filesystems.default', 'public'))->url($this->image_path)
                : null
        );
    }

    protected function documentUrl(): Attribute
    {
        return Attribute::make(
            get: fn() => $this->document_path
                ? Storage::disk(config('filesystems.default', 'public'))->url($this->document_path)
                : null
        );
    }
}
