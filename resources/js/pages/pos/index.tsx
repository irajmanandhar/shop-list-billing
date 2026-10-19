import { Head, Link, usePage } from '@inertiajs/react';
import { LayoutGrid, Search } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import type { Category, Product } from '@/types';
import CartPanel from './cart-panel';
import CheckoutDialog from './checkout-dialog';
import ProductGrid from './product-grid';
import { useCart } from './use-cart';

interface Props {
    products: Product[];
    categories: Category[];
}

function initialCategory(
    params: URLSearchParams,
    categories: Category[],
): number | null {
    const id = Number(params.get('category'));

    return categories.some((c) => c.id === id) ? id : null;
}

export default function PosIndex({ products, categories }: Props) {
    const taxRate = usePage().props.pos.tax_rate;
    const searchRef = useRef<HTMLInputElement>(null);
    const [search, setSearch] = useState('');
    const [activeCategory, setActiveCategory] = useState<number | null>(() =>
        initialCategory(
            new URLSearchParams(window.location.search),
            categories,
        ),
    );
    const {
        items,
        totals,
        count,
        discountPercent,
        setDiscountPercent,
        addItem,
        removeItem,
        setQuantity,
        clear,
    } = useCart(taxRate);
    const [showCheckout, setShowCheckout] = useState(false);

    // "/" focuses search, F2 opens checkout.
    useEffect(() => {
        function onKey(e: KeyboardEvent) {
            const typing = ['INPUT', 'TEXTAREA'].includes(
                (e.target as HTMLElement).tagName,
            );

            if (e.key === '/' && !typing) {
                e.preventDefault();
                searchRef.current?.focus();
            } else if (e.key === 'F2' && count > 0) {
                e.preventDefault();
                setShowCheckout(true);
            }
        }

        window.addEventListener('keydown', onKey);

        return () => window.removeEventListener('keydown', onKey);
    }, [count]);

    const filtered = products.filter(
        (p) =>
            (activeCategory === null || p.category_id === activeCategory) &&
            (p.name.toLowerCase().includes(search.toLowerCase()) ||
                p.category.name
                    .toLocaleLowerCase()
                    .includes(search.toLowerCase())),
    );

    return (
        <>
            <Head title="Point of Sale" />
            <div className="flex h-screen flex-col bg-background">
                {/* Top Bar */}
                <div className="flex items-center gap-4 border-b px-4 py-3">
                    <Link
                        href="/dashboard"
                        className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
                    >
                        <LayoutGrid className="h-5 w-5" />
                    </Link>
                    <span className="font-semibold">Point of Sale</span>
                    <div className="relative ml-4 max-w-sm flex-1">
                        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            className="pl-9"
                            ref={searchRef}
                            placeholder="Search products...  ( / )"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>
                {/* Category chips */}
                <div className="flex items-center gap-2 overflow-x-auto border-b px-4 py-2.5">
                    <button
                        type="button"
                        onClick={() => setActiveCategory(null)}
                        className={`shrink-0 cursor-pointer rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                            activeCategory === null
                                ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30'
                                : 'bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                        }`}
                    >
                        All
                    </button>
                    {categories.map((category) => (
                        <button
                            key={category.id}
                            type="button"
                            onClick={() => setActiveCategory(category.id)}
                            className={`shrink-0 cursor-pointer rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                                activeCategory === category.id
                                    ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30'
                                    : 'bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                            }`}
                        >
                            {category.name}
                        </button>
                    ))}
                </div>
                {/* Main area */}
                <div className="flex flex-1 flex-col overflow-hidden md:flex-row">
                    <ProductGrid
                        products={filtered}
                        onAdd={addItem}
                        inCart={(id) =>
                            items.find((i) => i.product.id === id)?.quantity ??
                            0
                        }
                    />
                    <CartPanel
                        items={items}
                        totals={totals}
                        taxRate={taxRate}
                        discountPercent={discountPercent}
                        onDiscount={setDiscountPercent}
                        onRemove={removeItem}
                        onSetQuantity={setQuantity}
                        onClear={clear}
                        onCheckout={() => setShowCheckout(true)}
                    />
                </div>
            </div>
            <CheckoutDialog
                open={showCheckout}
                items={items}
                totals={totals}
                discountPercent={discountPercent}
                onSuccess={clear}
                onClose={() => setShowCheckout(false)}
            />
        </>
    );
}
