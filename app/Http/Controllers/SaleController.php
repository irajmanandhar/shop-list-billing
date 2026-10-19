<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Sale;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class SaleController extends Controller
{
    public function index(Request $request): Response
    {
        $status = $request->query('status');

        $sales = Sale::with(['items', 'user:id,name'])
            ->when(in_array($status, ['completed', 'voided'], true), fn ($q) => $q->where('status', $status))
            ->when($request->string('q')->toString(), fn ($q, $term) => $q->where('id', (int) ltrim($term, '#')))
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('sales/index', [
            'sales' => $sales,
            'filters' => ['status' => $status, 'q' => $request->query('q')],
        ]);
    }

    public function void(Sale $sale): RedirectResponse
    {
        DB::transaction(function () use ($sale) {
            $sale = Sale::with('items')->lockForUpdate()->findOrFail($sale->id);

            if ($sale->status === 'voided') {
                return;
            }

            foreach ($sale->items as $item) {
                Product::whereKey($item->product_id)->increment('stock', $item->quantity);
            }

            $sale->update(['status' => 'voided', 'voided_at' => now()]);
        });

        return back();
    }
}
