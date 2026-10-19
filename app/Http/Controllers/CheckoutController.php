<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Sale;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class CheckoutController extends Controller
{
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'items' => ['required', 'array', 'min:1'],
            'items.*.product_id' => ['required', 'distinct', 'exists:products,id'],
            'items.*.quantity' => ['required', 'integer', 'min:1'],
            'payment_method' => ['required', Rule::in(['cash', 'card'])],
            'discount_percent' => ['nullable', 'numeric', 'min:0', 'max:100'],
            'cash_tendered' => ['required_if:payment_method,cash', 'nullable', 'numeric', 'min:0'],
        ]);

        $saleId = DB::transaction(function () use ($validated, $request) {
            // Money is computed in integer cents to avoid float drift.
            $subtotal = 0;
            $saleItems = [];

            // Lock in id order so concurrent checkouts cannot deadlock.
            $lines = $validated['items'];
            usort($lines, fn (array $a, array $b) => $a['product_id'] <=> $b['product_id']);

            foreach ($lines as $line) {
                $product = Product::whereKey($line['product_id'])->lockForUpdate()->firstOrFail();

                if (! $product->is_active || $product->stock < $line['quantity']) {
                    throw ValidationException::withMessages([
                        'items' => "Not enough stock for \"{$product->name}\".",
                    ]);
                }

                $lineCents = (int) round((float) $product->price * 100) * $line['quantity'];
                $subtotal += $lineCents;
                $saleItems[] = [
                    'product_id' => $product->id,
                    'product_name' => $product->name,
                    'unit_price' => $product->price,
                    'quantity' => $line['quantity'],
                    'subtotal' => $lineCents / 100,
                ];

                $product->decrement('stock', $line['quantity']);
            }

            $discount = (int) round($subtotal * (float) ($validated['discount_percent'] ?? 0) / 100);
            $tax = (int) round(($subtotal - $discount) * config('pos.tax_rate') / 100);
            $total = $subtotal - $discount + $tax;

            $isCash = $validated['payment_method'] === 'cash';
            $cash = $isCash ? (int) round((float) $validated['cash_tendered'] * 100) : $total;

            if ($cash < $total) {
                throw ValidationException::withMessages([
                    'cash_tendered' => 'Cash tendered is less than the total.',
                ]);
            }

            $sale = Sale::create([
                'user_id' => $request->user()->id,
                'subtotal' => $subtotal / 100,
                'discount' => $discount / 100,
                'tax' => $tax / 100,
                'total' => $total / 100,
                'cash_tendered' => $cash / 100,
                'change_amount' => ($cash - $total) / 100,
                'payment_method' => $validated['payment_method'],
            ]);

            $sale->items()->createMany($saleItems);

            return $sale->id;
        });

        return redirect()->route('receipt', $saleId);
    }

    public function receipt(Sale $sale): Response
    {
        return Inertia::render('pos/receipt', [
            'sale' => $sale->load('items'),
            'store_name' => config('pos.store_name'),
        ]);
    }
}
