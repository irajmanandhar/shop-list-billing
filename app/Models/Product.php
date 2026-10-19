<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable as AttributesFillable;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

#[AttributesFillable(['category_id', 'name', 'description', 'price', 'stock', 'image', 'is_active'])]
class Product extends Model
{
    protected $appends = ['image_url'];

    protected function imageUrl(): Attribute
    {
        return Attribute::get(fn () => $this->image
            ? Storage::disk(config('pos.image_disk'))->url($this->image)
            : null);
    }

    protected function cast(): array
    {
        return [
            'price' => 'decimal:2',
            'is_active' => 'boolean',
        ];
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }
}
