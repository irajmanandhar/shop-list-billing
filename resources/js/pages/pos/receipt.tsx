import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Sale } from '@/types';

interface Props {
    sale: Sale;
    store_name: string;
}

export default function Receipt({ sale, store_name }: Props) {
    const row = (label: string, value: string, strong = false) => (
        <div
            className={`flex justify-between ${strong ? 'text-base font-bold' : ''}`}
        >
            <span>{label}</span>
            <span>{value}</span>
        </div>
    );

    return (
        <>
            <Head title={`Receipt #${sale.id}`} />
            {/* Screen-only controls */}
            <div className="no-print flex gap-2 border-b p-4">
                <Link href="/pos">
                    <Button variant="outline">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        New sale
                    </Button>
                </Link>
                <Link href="/sales">
                    <Button variant="ghost">All sales</Button>
                </Link>
                <Button onClick={() => window.print()}>
                    <Printer className="mr-2 h-4 w-4" />
                    Print
                </Button>
            </div>

            <div className="receipt-paper relative mx-auto max-w-xs p-6 font-mono text-sm">
                {sale.status === 'voided' && (
                    <p className="mb-3 rounded border border-destructive py-1 text-center font-bold tracking-widest text-destructive">
                        VOIDED
                    </p>
                )}
                <div className="mb-4 text-center">
                    <p className="text-xl font-bold">{store_name}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                        {new Date(sale.created_at).toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground">
                        Receipt #{sale.id}
                    </p>
                </div>

                <div className="mb-3 space-y-2 border-t border-dashed pt-3">
                    {sale.items.map((item) => (
                        <div key={item.id}>
                            <div className="flex justify-between">
                                <span className="flex-1 truncate">
                                    {item.product_name}
                                </span>
                                <span className="ml-2">${item.subtotal}</span>
                            </div>
                            <div className="text-xs text-muted-foreground">
                                {item.quantity} × ${item.unit_price}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="space-y-1 border-t border-dashed pt-3">
                    {row('Subtotal', `$${sale.subtotal}`)}
                    {Number(sale.discount) > 0 &&
                        row('Discount', `-$${sale.discount}`)}
                    {row('Tax', `$${sale.tax}`)}
                    {row('TOTAL', `$${sale.total}`, true)}
                    {sale.payment_method === 'cash' ? (
                        <>
                            {row('Cash', `$${sale.cash_tendered}`)}
                            {row('Change', `$${sale.change_amount}`)}
                        </>
                    ) : (
                        row('Paid by', 'Card')
                    )}
                </div>

                <div className="mt-4 text-center text-xs text-muted-foreground">
                    Thank you for your purchase!
                </div>
            </div>
        </>
    );
}
