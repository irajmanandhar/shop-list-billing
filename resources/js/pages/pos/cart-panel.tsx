import { Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { CartItem } from '@/types';
import type { useCart } from './use-cart';

type Cart = ReturnType<typeof useCart>;

interface Props {
    items: CartItem[];
    totals: Cart['totals'];
    taxRate: number;
    discountPercent: number;
    onDiscount: (percent: number) => void;
    onRemove: (productId: number) => void;
    onSetQuantity: (productId: number, qty: number) => void;
    onClear: () => void;
    onCheckout: () => void;
}

const DISCOUNTS = [0, 5, 10, 20];

const money = (n: number) => `$${n.toFixed(2)}`;

export default function CartPanel({
    items,
    totals,
    taxRate,
    discountPercent,
    onDiscount,
    onRemove,
    onSetQuantity,
    onClear,
    onCheckout,
}: Props) {
    return (
        <aside className="flex w-full flex-col border-t md:w-96 md:border-t-0 md:border-l">
            <div className="flex items-center justify-between border-b px-4 py-3">
                <h2 className="font-semibold">Current order</h2>
                {items.length > 0 && (
                    <button
                        onClick={onClear}
                        className="cursor-pointer text-xs text-muted-foreground hover:text-destructive"
                    >
                        Clear all
                    </button>
                )}
            </div>
            <div className="flex-1 space-y-3 overflow-y-auto p-4">
                {items.length === 0 ? (
                    <div className="flex flex-col items-center gap-2 py-12 text-center text-muted-foreground">
                        <ShoppingBag className="h-8 w-8 opacity-40" />
                        <p className="text-sm">Tap a product to add it.</p>
                    </div>
                ) : (
                    items.map((item) => (
                        <div
                            key={item.product.id}
                            className="flex items-center gap-3"
                        >
                            <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-medium">
                                    {item.product.name}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    ${item.product.price} each
                                </p>
                            </div>
                            <div className="flex items-center gap-1 rounded-lg border">
                                <button
                                    aria-label={`Decrease ${item.product.name}`}
                                    className="cursor-pointer p-1.5 hover:bg-muted"
                                    onClick={() =>
                                        onSetQuantity(
                                            item.product.id,
                                            item.quantity - 1,
                                        )
                                    }
                                >
                                    <Minus className="h-3.5 w-3.5" />
                                </button>
                                <span className="w-6 text-center text-sm tabular-nums">
                                    {item.quantity}
                                </span>
                                <button
                                    aria-label={`Increase ${item.product.name}`}
                                    className="cursor-pointer p-1.5 hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
                                    disabled={
                                        item.quantity >= item.product.stock
                                    }
                                    onClick={() =>
                                        onSetQuantity(
                                            item.product.id,
                                            item.quantity + 1,
                                        )
                                    }
                                >
                                    <Plus className="h-3.5 w-3.5" />
                                </button>
                            </div>
                            <button
                                aria-label={`Remove ${item.product.name}`}
                                onClick={() => onRemove(item.product.id)}
                                className="cursor-pointer"
                            >
                                <Trash2 className="h-4 w-4 text-destructive" />
                            </button>
                        </div>
                    ))
                )}
            </div>
            <div className="space-y-3 border-t p-4">
                <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Discount</span>
                    <div className="flex gap-1">
                        {DISCOUNTS.map((d) => (
                            <button
                                key={d}
                                type="button"
                                onClick={() => onDiscount(d)}
                                className={`cursor-pointer rounded-md px-2 py-1 text-xs font-medium ${
                                    discountPercent === d
                                        ? 'bg-emerald-600 text-white'
                                        : 'bg-muted text-muted-foreground hover:bg-accent'
                                }`}
                            >
                                {d === 0 ? 'None' : `${d}%`}
                            </button>
                        ))}
                    </div>
                </div>
                <dl className="space-y-1 text-sm">
                    <div className="flex justify-between text-muted-foreground">
                        <dt>Subtotal</dt>
                        <dd>{money(totals.subtotal)}</dd>
                    </div>
                    {totals.discount > 0 && (
                        <div className="flex justify-between text-emerald-600">
                            <dt>Discount</dt>
                            <dd>−{money(totals.discount)}</dd>
                        </div>
                    )}
                    <div className="flex justify-between text-muted-foreground">
                        <dt>Tax ({taxRate}%)</dt>
                        <dd>{money(totals.tax)}</dd>
                    </div>
                    <div className="flex justify-between pt-1 text-lg font-bold">
                        <dt>Total</dt>
                        <dd>{money(totals.total)}</dd>
                    </div>
                </dl>
                <Button
                    className="w-full"
                    size="lg"
                    disabled={items.length === 0}
                    onClick={onCheckout}
                >
                    Charge {money(totals.total)}
                    <kbd className="ml-2 hidden rounded bg-white/20 px-1.5 text-xs md:inline">
                        F2
                    </kbd>
                </Button>
            </div>
        </aside>
    );
}
