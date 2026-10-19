import type { Product } from '@/types';

interface Props {
    products: Product[];
    onAdd: (product: Product) => void;
    inCart: (id: number) => number;
}

export default function ProductGrid({ products, onAdd, inCart }: Props) {
    if (products.length === 0) {
        return (
            <div className="flex flex-1 items-center justify-center text-muted-foreground">
                No Products found.
            </div>
        );
    }

    return (
        <div className="flex-1 overflow-y-auto p-4">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {products.map((product) => (
                    <button
                        key={product.id}
                        onClick={() => onAdd(product)}
                        disabled={inCart(product.id) >= product.stock}
                        className="group flex cursor-pointer flex-col overflow-hidden rounded-xl border bg-card text-left transition-all hover:border-primary hover:shadow-md active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {product.image ? (
                            <img
                                src={product.image_url ?? ''}
                                loading="lazy"
                                alt={product.name}
                                className="aspect-square w-full object-cover"
                            />
                        ) : (
                            <div className="flex aspect-square w-full items-center justify-center bg-muted text-3xl text-muted-foreground">
                                {product.name.charAt(0)}
                            </div>
                        )}
                        <div className="relative p-2">
                            {inCart(product.id) > 0 && (
                                <span className="absolute -top-3 right-2 rounded-full bg-emerald-600 px-2 py-0.5 text-xs font-bold text-white">
                                    {inCart(product.id)}
                                </span>
                            )}
                            <p className="truncate text-sm font-medium">
                                {product.name}
                            </p>
                            <p className="text-sm font-bold text-primary">
                                ${product.price}
                            </p>
                            <p
                                className={`text-xs ${product.stock <= 5 ? 'font-medium text-amber-600' : 'text-muted-foreground'}`}
                            >
                                {product.stock <= 5 ? 'Only ' : 'Stock: '}
                                {product.stock}
                                {product.stock <= 5 ? ' left' : ''}
                            </p>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
}
