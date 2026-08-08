<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable as AttributesFillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[AttributesFillable(['category_id', 'name', 'description', 'price', 'stock', 'image', 'is_active'])]
class Product extends Model
{
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
