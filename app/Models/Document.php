<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Storage;

class Document extends Model
{
    protected $fillable = [
        'user_id',
        'title',
        'slug',
        'document_category',
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
        'short_description',
        'ai_prompt',
        'is_active',
        'is_featured',
        'sort_order',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'is_active' => 'boolean',
        'is_featured' => 'boolean',
        'sort_order' => 'integer',
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

    // public function scopeActive(Builder $query): Builder
    // {
    //     return $query->where('is_active', true);
    // }

    // public function scopeOrdered(Builder $query): Builder
    // {
    //     return $query->orderBy('sort_order')->orderBy('title');
    // }

    protected function imageUrl(): Attribute
    {
        return Attribute::make(
            get: function () {
                if (!$this->image_path) {
                    return asset('images/products/placeholder.webp');
                }

                return Storage::disk(config('filesystems.default'))->url($this->image_path);
            }
        );
    }

    protected function documentUrl(): Attribute
    {
        return Attribute::make(
            get: function () {
                if (!$this->document_path) {
                    return null;
                }

                return Storage::disk(config('filesystems.default'))->url($this->document_path);
            }
        );
    }
}
