<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Sale;
use App\Models\SaleItem;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $today = today();

        $todaySales = Sale::whereDate('created_at', $today)
            ->where('status', 'completed')
            ->get();

        $revenueHistory = Sale::where('status', 'completed')
            ->whereDate('created_at', '>=', $today->copy()->subDays(6))
            ->selectRaw('DATE(created_at) as date, SUM(total) as total')
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        $revenueHistory = collect(range(6, 0))->map(function (int $offset) use ($revenueHistory, $today): array {
            $day = $today->copy()->subDays($offset);
            $row = $revenueHistory->firstWhere('date', $day->toDateString());

            return [
                'date' => $day->format('D'),
                'total' => $row ? $row->total : '0.00',
            ];
        });

        // top products
        $topProduct = SaleItem::select(
            'product_name',
            DB::raw('SUM(quantity) as total_qty'),
            DB::raw('SUM(subtotal) as total_revenue')
        )
            ->whereHas('sale', fn ($q) => $q->whereDate('created_at', $today)->where('status', 'completed'))
            ->groupBy('product_name')
            ->orderByDesc('total_qty')
            ->limit(5)
            ->get();

        // revenue by category
        $categoryRevenue = SaleItem::select(
            'categories.name as category_name',
            DB::raw('SUM(sales_items.subtotal) as total')
        )
            ->join('sales', 'sales.id', '=', 'sales_items.sale_id')
            ->join('products', 'products.id', '=', 'sales_items.product_id')
            ->join('categories', 'categories.id', '=', 'products.category_id')
            ->where('sales.status', 'completed')
            ->whereDate('sales.created_at', $today)
            ->groupBy('categories.name')
            ->orderByDesc('total')
            ->limit(5)
            ->get();

        // recent sales
        $recentSales = Sale::with('items')
            ->latest()
            ->limit(10)
            ->get();

        // low stock
        $lowStockProducts = Product::where('stock', '<=', 5)
            ->orderBy('stock')
            ->limit(6)
            ->get(['id', 'name', 'stock', 'is_active']);

        return Inertia::render('dashboard', [
            'stats' => [
                'today_revenue' => $todaySales->sum('total'),
                'today_transactions' => $todaySales->count(),
                'total_products' => Product::where('is_active', true)->count(),
                'low_stock_count' => Product::where('stock', '<=', 5)->count(),
            ],
            'revenue_history' => $revenueHistory,
            'top_products' => $topProduct,
            'category_revenue' => $categoryRevenue,
            'recent_sales' => $recentSales,
            'low_stock_products' => $lowStockProducts,
        ]);
    }
}
