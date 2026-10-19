<?php

use App\Models\Category;
use App\Models\Product;
use App\Models\Sale;
use App\Models\User;

beforeEach(function () {
    config(['pos.tax_rate' => 10]);
    $this->user = User::factory()->create();
    $this->product = Product::create([
        'category_id' => Category::create(['name' => 'Drinks'])->id,
        'name' => 'Latte',
        'price' => 4.25,
        'stock' => 10,
    ]);
});

function checkout(array $overrides = []): array
{
    return array_merge([
        'items' => [['product_id' => test()->product->id, 'quantity' => 3]],
        'payment_method' => 'cash',
        'cash_tendered' => 20,
    ], $overrides);
}

it('computes totals in cents, decrements stock and records the sale', function () {
    $this->actingAs($this->user)
        ->post('/checkout', checkout(['discount_percent' => 10]))
        ->assertRedirect();

    $sale = Sale::firstOrFail();
    // 12.75 - 10% (1.28) = 11.47 + 10% tax (1.15) = 12.62
    expect($sale->subtotal)->toBe('12.75')
        ->and($sale->discount)->toBe('1.28')
        ->and($sale->tax)->toBe('1.15')
        ->and($sale->total)->toBe('12.62')
        ->and($sale->change_amount)->toBe('7.38')
        ->and($this->product->fresh()->stock)->toBe(7);
});

it('rejects insufficient stock and rolls back', function () {
    $this->actingAs($this->user)
        ->post('/checkout', checkout(['items' => [['product_id' => $this->product->id, 'quantity' => 11]]]))
        ->assertSessionHasErrors('items');

    expect(Sale::count())->toBe(0)->and($this->product->fresh()->stock)->toBe(10);
});

it('rejects cash below the total', function () {
    $this->actingAs($this->user)
        ->post('/checkout', checkout(['cash_tendered' => 5]))
        ->assertSessionHasErrors('cash_tendered');

    expect($this->product->fresh()->stock)->toBe(10);
});

it('accepts card payments without cash', function () {
    $this->actingAs($this->user)
        ->post('/checkout', checkout(['payment_method' => 'card', 'cash_tendered' => null]))
        ->assertRedirect();

    expect(Sale::first()->change_amount)->toBe('0.00');
});

it('voids a sale once and restores stock', function () {
    $this->actingAs($this->user)->post('/checkout', checkout());
    $sale = Sale::firstOrFail();

    $this->post("/sales/{$sale->id}/void")->assertRedirect();
    $this->post("/sales/{$sale->id}/void")->assertRedirect();

    expect($sale->fresh()->status)->toBe('voided')
        ->and($this->product->fresh()->stock)->toBe(10);
});

it('requires authentication', function () {
    $this->post('/checkout', checkout())->assertRedirect('/login');
});
