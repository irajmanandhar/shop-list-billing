import { Head, Link, router } from '@inertiajs/react';
import { Banknote, CreditCard, Receipt, Search } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { Sale } from '@/types';

interface Paginated<T> {
    data: T[];
    prev_page_url: string | null;
    next_page_url: string | null;
    current_page: number;
    last_page: number;
    total: number;
}

interface Props {
    sales: Paginated<Sale>;
    filters: { status: string | null; q: string | null };
}

const STATUSES = [
    ['', 'All'],
    ['completed', 'Completed'],
    ['voided', 'Voided'],
] as const;

export default function SalesIndex({ sales, filters }: Props) {
    const [q, setQ] = useState(filters.q ?? '');

    function apply(next: Partial<Props['filters']>) {
        router.get(
            '/sales',
            { ...filters, ...next },
            { preserveState: true, replace: true },
        );
    }

    function handleVoid(sale: Sale) {
        if (!confirm(`Void sale #${sale.id}? Stock will be restored.`)) {
            return;
        }

        router.post(
            `/sales/${sale.id}/void`,
            {},
            {
                preserveScroll: true,
                onSuccess: () => toast.success(`Sale #${sale.id} voided`),
            },
        );
    }

    return (
        <>
            <Head title="Sales" />
            <div className="space-y-4 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h1 className="text-xl font-semibold">Sales history</h1>
                        <p className="text-sm text-muted-foreground">
                            {sales.total} transactions
                        </p>
                    </div>
                    <form
                        className="relative"
                        onSubmit={(e) => {
                            e.preventDefault();
                            apply({ q: q || null });
                        }}
                    >
                        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            className="w-56 pl-9"
                            placeholder="Receipt #"
                            value={q}
                            onChange={(e) => setQ(e.target.value)}
                        />
                    </form>
                </div>

                <div className="flex gap-2">
                    {STATUSES.map(([value, label]) => (
                        <button
                            key={label}
                            onClick={() => apply({ status: value || null })}
                            className={`cursor-pointer rounded-full px-3.5 py-1.5 text-xs font-semibold ${
                                (filters.status ?? '') === value
                                    ? 'bg-emerald-600 text-white'
                                    : 'bg-muted text-muted-foreground hover:bg-accent'
                            }`}
                        >
                            {label}
                        </button>
                    ))}
                </div>

                <div className="overflow-x-auto rounded-xl border">
                    <table className="w-full text-sm">
                        <thead className="bg-muted/50 text-left text-xs text-muted-foreground">
                            <tr>
                                <th className="p-3">Receipt</th>
                                <th className="p-3">Date</th>
                                <th className="p-3">Items</th>
                                <th className="p-3">Payment</th>
                                <th className="p-3 text-right">Total</th>
                                <th className="p-3">Status</th>
                                <th className="p-3" />
                            </tr>
                        </thead>
                        <tbody>
                            {sales.data.map((sale) => (
                                <tr key={sale.id} className="border-t">
                                    <td className="p-3 font-medium">
                                        #{sale.id}
                                    </td>
                                    <td className="p-3 whitespace-nowrap text-muted-foreground">
                                        {new Date(
                                            sale.created_at,
                                        ).toLocaleString()}
                                    </td>
                                    <td className="max-w-56 truncate p-3">
                                        {sale.items
                                            .map(
                                                (i) =>
                                                    `${i.quantity}× ${i.product_name}`,
                                            )
                                            .join(', ')}
                                    </td>
                                    <td className="p-3">
                                        <span className="inline-flex items-center gap-1.5 capitalize">
                                            {sale.payment_method === 'cash' ? (
                                                <Banknote className="h-4 w-4" />
                                            ) : (
                                                <CreditCard className="h-4 w-4" />
                                            )}
                                            {sale.payment_method}
                                        </span>
                                    </td>
                                    <td
                                        className={`p-3 text-right tabular-nums ${sale.status === 'voided' ? 'line-through opacity-60' : ''}`}
                                    >
                                        ${sale.total}
                                    </td>
                                    <td className="p-3">
                                        <Badge
                                            variant={
                                                sale.status === 'voided'
                                                    ? 'destructive'
                                                    : 'secondary'
                                            }
                                        >
                                            {sale.status}
                                        </Badge>
                                    </td>
                                    <td className="space-x-1 p-3 text-right whitespace-nowrap">
                                        <Button
                                            asChild
                                            size="sm"
                                            variant="ghost"
                                        >
                                            <Link href={`/receipt/${sale.id}`}>
                                                <Receipt className="h-4 w-4" />
                                            </Link>
                                        </Button>
                                        {sale.status === 'completed' && (
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                className="text-destructive"
                                                onClick={() => handleVoid(sale)}
                                            >
                                                Void
                                            </Button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {sales.data.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={7}
                                        className="p-8 text-center text-muted-foreground"
                                    >
                                        No sales found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                        Page {sales.current_page} of {sales.last_page}
                    </span>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={!sales.prev_page_url}
                            onClick={() =>
                                sales.prev_page_url &&
                                router.get(sales.prev_page_url)
                            }
                        >
                            Previous
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={!sales.next_page_url}
                            onClick={() =>
                                sales.next_page_url &&
                                router.get(sales.next_page_url)
                            }
                        >
                            Next
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
}

SalesIndex.layout = {
    breadcrumbs: [{ title: 'Sales', href: '/sales' }],
};
