<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable as AttributesFillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[AttributesFillable(['name', 'description'])]
class Category extends Model
{
    public function products(): HasMany
    {
        return $this->hasMany(Product::class);
    }
}
