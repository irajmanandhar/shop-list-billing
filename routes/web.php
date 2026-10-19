<?php

use App\Http\Controllers\CategoryController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\PosController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\SaleController;
use App\Models\User;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return auth()->check()
        ? Redirect::route('dashboard')
        : Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::resource('products', ProductController::class)->except(['create', 'show', 'edit']);
    Route::resource('categories', CategoryController::class)->except(['create', 'show', 'edit']);
    Route::get('pos', [PosController::class, 'index'])->name('pos.index');
    Route::post('checkout', [CheckoutController::class, 'store'])->name('checkout');
    Route::get('sales', [SaleController::class, 'index'])->name('sales.index');
    Route::post('sales/{sale}/void', [SaleController::class, 'void'])->name('sales.void');
    Route::get('receipt/{sale}', [CheckoutController::class, 'receipt'])->name('receipt');
});

if (config('pos.demo')) {
    // GET /demo is a shareable one-click entry (portfolio link); POST backs the login button.
    Route::match(['get', 'post'], 'demo', function () {
        auth()->login(User::where('email', 'demo@pulsepos.test')->firstOrFail());
        request()->session()->regenerate();

        return Redirect::route('dashboard');
    })->middleware('guest')->name('demo.login');
}

require __DIR__.'/settings.php';
