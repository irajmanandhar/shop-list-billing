<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use Inertia\Inertia;
use Inertia\Response;

class PosController extends Controller
{
    public function index(): Response
    {
        $products = Product::with('category')
            ->where('is_active', true)
            ->where('stock', '>', 0)
            ->orderBy('name')
            ->get();

        $categories = Category::whereHas('products', fn ($q) => $q->where('is_active', true)->where('stock', '>', 0))
            ->orderBy('name')
            ->get(['id', 'name']);

        return Inertia::render('pos/index', [
            'products' => $products,
            'categories' => $categories,
        ]);
    }
}
