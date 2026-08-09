import { Head, Link, usePage } from '@inertiajs/react';
import {
    AlertTriangle,
    ArrowRight,
    BadgeCheck,
    CircleDollarSign,
    Layers,
    Package,
    Receipt,
    ShoppingBag,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { dashboard } from '@/routes';
import type { Sale } from '@/types';

interface Stats {
    today_revenue: string;
    today_transactions: number;
    total_products: number;
    low_stock_count: number;
}

interface TopProduct {
    product_name: string;
    total_qty: number;
    total_revenue: string;
}

interface RevenuePoint {
    date: string;
    total: string;
}

interface CategoryRevenue {
    category_name: string;
    total: string;
}

interface LowStockProduct {
    id: number;
    name: string;
    stock: number;
    is_active: boolean;
}

interface Props {
    stats: Stats;
    revenue_history: RevenuePoint[];
    top_products: TopProduct[];
    category_revenue: CategoryRevenue[];
    recent_sales: Sale[];
    low_stock_products: LowStockProduct[];
}

const currency = (value: string | number): string =>
    new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(Number(value));

export default function Dashboard({
    stats,
    revenue_history,
    top_products,
    category_revenue,
    recent_sales,
    low_stock_products,
}: Props) {
    const { auth } = usePage().props;
    const firstName = auth.user?.name?.split(' ')[0] ?? 'there';
    const hour = new Date().getHours();
    const greeting =
        hour < 12
            ? 'Good morning'
            : hour < 18
              ? 'Good afternoon'
              : 'Good evening';
    const todayLabel = new Date().toLocaleDateString(undefined, {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
    });

    return (
        <>
            <Head title="Dashboard" />
            <div className="mx-auto w-full max-w-7xl space-y-6 p-4 md:p-6">
                <Hero greeting={greeting} name={firstName} date={todayLabel} />

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <StatCard
                        label="Today's Revenue"
                        value={currency(stats.today_revenue)}
                        hint={`${stats.today_transactions} transaction${stats.today_transactions === 1 ? '' : 's'} today`}
                        icon={CircleDollarSign}
                        tone="emerald"
                    />
                    <StatCard
                        label="Transactions"
                        value={stats.today_transactions.toString()}
                        hint="Completed sales today"
                        icon={Receipt}
                        tone="teal"
                    />
                    <StatCard
                        label="Active Products"
                        value={stats.total_products.toString()}
                        hint="Ready to sell"
                        icon={Package}
                        tone="indigo"
                    />
                    <StatCard
                        label="Low Stock"
                        value={stats.low_stock_count.toString()}
                        hint="Items at 5 or fewer"
                        icon={AlertTriangle}
                        tone="amber"
                    />
                </div>

                <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
                    <RevenueChart
                        data={revenue_history}
                        className="xl:col-span-2"
                    />
                    <TopProducts data={top_products} />
                </div>

                <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
                    <RecentSales
                        data={recent_sales}
                        className="xl:col-span-2"
                    />
                    <div className="space-y-6">
                        <LowStock items={low_stock_products} />
                        <CategoryRevenueCard data={category_revenue} />
                    </div>
                </div>
            </div>
        </>
    );
}

function Hero({
    greeting,
    name,
    date,
}: {
    greeting: string;
    name: string;
    date: string;
}) {
    return (
        <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-500 p-6 text-white shadow-lg shadow-emerald-600/25 md:p-8">
            <div className="absolute inset-0 bg-dots" />
            <div className="absolute -top-16 -right-16 size-64 rounded-full bg-white/10 blur-2xl" />
            <div className="absolute -bottom-24 -left-10 size-72 rounded-full bg-teal-300/20 blur-3xl" />
            <div className="relative">
                <p className="text-sm font-medium text-emerald-50">{date}</p>
                <h1 className="mt-1 text-2xl font-extrabold tracking-tight md:text-3xl">
                    {greeting}, {name}
                </h1>
                <p className="mt-1 max-w-lg text-sm text-emerald-50/90 md:text-base">
                    Here's what's happening at your store today. Keep the
                    register moving.
                </p>
                <div className="mt-5 flex flex-wrap gap-3">
                    <Button
                        asChild
                        size="lg"
                        className="bg-white text-emerald-700 shadow-md hover:bg-emerald-50"
                    >
                        <Link href="/pos">
                            <ShoppingBag className="size-4" />
                            Open register
                        </Link>
                    </Button>
                    <Button
                        asChild
                        size="lg"
                        variant="ghost"
                        className="text-white hover:bg-white/15 hover:text-white"
                    >
                        <Link href="/products">
                            Manage products
                            <ArrowRight className="size-4" />
                        </Link>
                    </Button>
                </div>
            </div>
        </section>
    );
}

function StatCard({
    label,
    value,
    hint,
    icon: Icon,
    tone,
}: {
    label: string;
    value: string;
    hint: string;
    icon: typeof CircleDollarSign;
    tone: 'emerald' | 'teal' | 'indigo' | 'amber';
}) {
    const tones = {
        emerald:
            'bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400',
        teal: 'bg-teal-500/10 text-teal-600 dark:bg-teal-500/15 dark:text-teal-400',
        indigo: 'bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-400',
        amber: 'bg-amber-500/10 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400',
    }[tone];

    return (
        <div className="rounded-2xl border bg-card p-5 shadow-sm transition-shadow hover:shadow-md">
            <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">
                    {label}
                </p>
                <div
                    className={`flex size-9 items-center justify-center rounded-xl ${tones}`}
                >
                    <Icon className="size-4.5" />
                </div>
            </div>
            <p className="mt-2 text-2xl font-extrabold tracking-tight">
                {value}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
        </div>
    );
}

function RevenueChart({
    data,
    className = '',
}: {
    data: RevenuePoint[];
    className?: string;
}) {
    const totals = data.map((d) => Number(d.total));
    const max = Math.max(...totals, 1);
    const weekTotal = totals.reduce((sum, v) => sum + v, 0);

    return (
        <div
            className={`rounded-2xl border bg-card p-5 shadow-sm ${className}`}
        >
            <div className="flex items-baseline justify-between">
                <div>
                    <h2 className="font-bold">Revenue — last 7 days</h2>
                    <p className="text-sm text-muted-foreground">
                        Completed sales, Monday to Sunday
                    </p>
                </div>
                <p className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400">
                    {currency(weekTotal)}
                </p>
            </div>
            <div className="mt-6 flex h-44 items-end gap-2 sm:gap-3">
                {data.map((point, index) => {
                    const value = Number(point.total);
                    const isToday = index === data.length - 1;

                    return (
                        <div
                            key={point.date}
                            className="group relative flex h-full flex-1 flex-col justify-end"
                            title={`${point.date}: ${currency(value)}`}
                        >
                            <div
                                className={`w-full rounded-t-lg transition-all duration-300 group-hover:opacity-80 ${
                                    isToday
                                        ? 'bg-gradient-to-t from-emerald-600 to-teal-400 shadow-sm shadow-emerald-500/40'
                                        : 'bg-gradient-to-t from-emerald-500/80 to-teal-400/80'
                                }`}
                                style={{
                                    height: `${Math.max((value / max) * 100, 2)}%`,
                                }}
                            />
                            <p
                                className={`mt-2 text-center text-[11px] font-medium ${
                                    isToday
                                        ? 'text-emerald-600 dark:text-emerald-400'
                                        : 'text-muted-foreground'
                                }`}
                            >
                                {point.date}
                            </p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

function TopProducts({
    data,
    className = '',
}: {
    data: TopProduct[];
    className?: string;
}) {
    const maxQty = Math.max(...data.map((p) => p.total_qty), 1);

    return (
        <div
            className={`rounded-2xl border bg-card p-5 shadow-sm ${className}`}
        >
            <h2 className="font-bold">Top Products Today</h2>
            <p className="text-sm text-muted-foreground">
                Best sellers by units
            </p>
            <div className="mt-4 space-y-4">
                {data.length === 0 && (
                    <p className="py-8 text-center text-sm text-muted-foreground">
                        No sales yet today.
                    </p>
                )}
                {data.map((product, index) => (
                    <div key={product.product_name}>
                        <div className="flex items-center gap-3">
                            <span
                                className={`flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                                    index === 0
                                        ? 'bg-emerald-500 text-white'
                                        : index === 1
                                          ? 'bg-teal-500 text-white'
                                          : 'bg-muted text-muted-foreground'
                                }`}
                            >
                                {index + 1}
                            </span>
                            <div className="min-w-0 flex-1">
                                <div className="flex items-baseline justify-between gap-2">
                                    <p className="truncate text-sm font-semibold">
                                        {product.product_name}
                                    </p>
                                    <p className="shrink-0 text-sm font-bold text-emerald-600 dark:text-emerald-400">
                                        {currency(product.total_revenue)}
                                    </p>
                                </div>
                                <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-muted">
                                    <div
                                        className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400"
                                        style={{
                                            width: `${(product.total_qty / maxQty) * 100}%`,
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function CategoryRevenueCard({
    data,
    className = '',
}: {
    data: CategoryRevenue[];
    className?: string;
}) {
    const max = Math.max(...data.map((c) => Number(c.total)), 1);
    const barTones = [
        'from-emerald-500 to-emerald-400',
        'from-teal-500 to-teal-400',
        'from-lime-500 to-lime-400',
        'from-cyan-500 to-cyan-400',
        'from-emerald-600 to-teal-500',
    ];

    return (
        <div
            className={`rounded-2xl border bg-card p-5 shadow-sm ${className}`}
        >
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="font-bold">Revenue by Category</h2>
                    <p className="text-sm text-muted-foreground">
                        Today's sales split
                    </p>
                </div>
                <div className="flex size-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400">
                    <Layers className="size-4.5" />
                </div>
            </div>
            <div className="mt-4 space-y-3.5">
                {data.length === 0 && (
                    <p className="py-8 text-center text-sm text-muted-foreground">
                        No category sales yet today.
                    </p>
                )}
                {data.map((item, index) => (
                    <div key={item.category_name}>
                        <div className="flex items-baseline justify-between text-sm">
                            <p className="truncate font-medium">
                                {item.category_name}
                            </p>
                            <p className="shrink-0 font-bold">
                                {currency(item.total)}
                            </p>
                        </div>
                        <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-muted">
                            <div
                                className={`h-full rounded-full bg-gradient-to-r ${barTones[index % barTones.length]}`}
                                style={{
                                    width: `${Math.max((Number(item.total) / max) * 100, 4)}%`,
                                }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function RecentSales({
    data,
    className = '',
}: {
    data: Sale[];
    className?: string;
}) {
    return (
        <div
            className={`rounded-2xl border bg-card p-5 shadow-sm ${className}`}
        >
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="font-bold">Recent Sales</h2>
                    <p className="text-sm text-muted-foreground">
                        Latest completed transactions
                    </p>
                </div>
                <Link
                    href="/pos"
                    className="inline-flex items-center gap-1 text-sm font-semibold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400"
                >
                    Open POS
                    <ArrowRight className="size-3.5" />
                </Link>
            </div>
            <div className="mt-4 space-y-1">
                {data.length === 0 && (
                    <p className="py-8 text-center text-sm text-muted-foreground">
                        No sales recorded yet. Head to the register!
                    </p>
                )}
                {data.map((sale) => {
                    const items = sale.items.slice(0, 2);
                    const extra = sale.items.length - items.length;

                    return (
                        <div
                            key={sale.id}
                            className="flex items-center gap-3 rounded-xl px-2 py-2.5 transition-colors hover:bg-muted/50"
                        >
                            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                                <Receipt className="size-4.5" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="text-sm font-semibold">
                                    Sale #{sale.id}
                                </p>
                                <p className="truncate text-xs text-muted-foreground">
                                    {items
                                        .map(
                                            (item) =>
                                                `${item.product_name} × ${item.quantity}`,
                                        )
                                        .join(', ')}
                                    {extra > 0 && ` +${extra} more`}
                                </p>
                            </div>
                            <div className="shrink-0 text-right">
                                <p className="text-sm font-bold">
                                    {currency(sale.total)}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    {new Date(
                                        sale.created_at,
                                    ).toLocaleTimeString(undefined, {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

function LowStock({
    items,
    className = '',
}: {
    items: LowStockProduct[];
    className?: string;
}) {
    return (
        <div
            className={`rounded-2xl border bg-card p-5 shadow-sm ${className}`}
        >
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="font-bold">Stock Alerts</h2>
                    <p className="text-sm text-muted-foreground">
                        Products running low
                    </p>
                </div>
                <Link
                    href="/products"
                    className="inline-flex items-center gap-1 text-sm font-semibold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400"
                >
                    Products
                    <ArrowRight className="size-3.5" />
                </Link>
            </div>
            <div className="mt-4 space-y-2">
                {items.length === 0 && (
                    <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed py-8 text-center">
                        <BadgeCheck className="size-6 text-emerald-500" />
                        <p className="text-sm text-muted-foreground">
                            All products are well stocked.
                        </p>
                    </div>
                )}
                {items.map((product) => {
                    const outOfStock = product.stock === 0;

                    return (
                        <div
                            key={product.id}
                            className="flex items-center justify-between gap-3 rounded-xl border px-3 py-2.5"
                        >
                            <div className="min-w-0">
                                <p className="truncate text-sm font-semibold">
                                    {product.name}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    {product.is_active ? 'Active' : 'Inactive'}
                                </p>
                            </div>
                            <span
                                className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-bold ${
                                    outOfStock
                                        ? 'bg-red-500/10 text-red-600 dark:bg-red-500/15 dark:text-red-400'
                                        : 'bg-amber-500/10 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400'
                                }`}
                            >
                                {outOfStock
                                    ? 'Out of stock'
                                    : `${product.stock} left`}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
    ],
};
