import { router } from '@inertiajs/react';
import { Banknote, CreditCard } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { CartItem } from '@/types';
import type { useCart } from './use-cart';

interface Props {
    open: boolean;
    items: CartItem[];
    totals: ReturnType<typeof useCart>['totals'];
    discountPercent: number;
    onSuccess: () => void;
    onClose: () => void;
}

type Method = 'cash' | 'card';

export default function CheckoutDialog({
    open,
    items,
    totals,
    discountPercent,
    onSuccess,
    onClose,
}: Props) {
    const [method, setMethod] = useState<Method>('cash');
    const [cashInput, setCashInput] = useState('');
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const total = totals.total;
    const cash = parseFloat(cashInput) || 0;
    const change = cash - total;
    // Whole-dollar bumps above the total: exact, next $5, next $10, next $20.
    const quick = [
        total,
        ...[5, 10, 20].map((n) => Math.ceil(total / n) * n),
    ].filter((v, i, a) => a.indexOf(v) === i);
    const canPay = method === 'card' || (cashInput !== '' && cash >= total);

    function handleCheckout() {
        setError(null);
        setProcessing(true);

        router.post(
            '/checkout',
            {
                items: items.map((i) => ({
                    product_id: i.product.id,
                    quantity: i.quantity,
                })),
                payment_method: method,
                discount_percent: discountPercent,
                cash_tendered: method === 'cash' ? cash : null,
            },
            {
                onSuccess: () => {
                    setCashInput('');
                    onSuccess();
                },
                onError: (errors) => {
                    setError(Object.values(errors)[0] as string);
                    toast.error('Checkout failed.');
                },
                onFinish: () => setProcessing(false),
            },
        );
    }

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-sm">
                <DialogHeader>
                    <DialogTitle>Take payment</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <div className="rounded-lg bg-muted p-4 text-center">
                        <p className="text-xs text-muted-foreground">
                            Amount due
                        </p>
                        <p className="text-3xl font-bold tabular-nums">
                            ${total.toFixed(2)}
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        {(
                            [
                                ['cash', 'Cash', Banknote],
                                ['card', 'Card', CreditCard],
                            ] as const
                        ).map(([key, label, Icon]) => (
                            <button
                                key={key}
                                type="button"
                                onClick={() => setMethod(key)}
                                className={`flex cursor-pointer items-center justify-center gap-2 rounded-lg border p-3 text-sm font-medium ${
                                    method === key
                                        ? 'border-emerald-600 bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                                        : 'hover:bg-muted'
                                }`}
                            >
                                <Icon className="h-4 w-4" />
                                {label}
                            </button>
                        ))}
                    </div>

                    {method === 'cash' && (
                        <div className="space-y-2">
                            <Label htmlFor="cash">Cash tendered</Label>
                            <Input
                                id="cash"
                                type="number"
                                step="0.01"
                                placeholder="0.00"
                                value={cashInput}
                                onChange={(e) => {
                                    setCashInput(e.target.value);
                                    setError(null);
                                }}
                                onKeyDown={(e) =>
                                    e.key === 'Enter' &&
                                    canPay &&
                                    !processing &&
                                    handleCheckout()
                                }
                                autoFocus
                            />
                            <div className="flex gap-2">
                                {quick.map((v) => (
                                    <button
                                        key={v}
                                        type="button"
                                        onClick={() =>
                                            setCashInput(v.toFixed(2))
                                        }
                                        className="flex-1 cursor-pointer rounded-md bg-muted py-1.5 text-xs font-medium hover:bg-accent"
                                    >
                                        ${v.toFixed(2)}
                                    </button>
                                ))}
                            </div>
                            {cashInput && (
                                <div className="flex justify-between text-lg font-bold">
                                    <span>Change</span>
                                    <span
                                        className={
                                            change >= 0
                                                ? 'text-green-600'
                                                : 'text-destructive'
                                        }
                                    >
                                        ${change.toFixed(2)}
                                    </span>
                                </div>
                            )}
                        </div>
                    )}

                    {error && (
                        <p className="text-sm text-destructive">{error}</p>
                    )}

                    <Button
                        className="w-full"
                        size="lg"
                        disabled={processing || !canPay}
                        onClick={handleCheckout}
                    >
                        {processing ? 'Processing...' : 'Complete sale'}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
