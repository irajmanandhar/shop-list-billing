import { Head, router } from '@inertiajs/react';
import { Pencil, Package, Plus, Search, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import type { Category, Product } from '@/types';
import ProductForm from './product-form';

interface Props {
    products: Product[];
    categories: Category[];
}

export default function ProductIndex({ products, categories }: Props) {
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState<Product | null>(null);
    const [search, setSearch] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');

    const filtered = useMemo(() => {
        const query = search.trim().toLowerCase();

        return products.filter((product) => {
            const matchesCategory =
                categoryFilter === 'all' ||
                product.category_id.toString() === categoryFilter;
            const matchesQuery =
                query === '' ||
                product.name.toLowerCase().includes(query) ||
                product.category.name.toLowerCase().includes(query);

            return matchesCategory && matchesQuery;
        });
    }, [products, search, categoryFilter]);

    function handleEdit(product: Product) {
        setEditing(product);
        setShowForm(true);
    }

    function handleDelete(product: Product) {
        if (!confirm(`Delete "${product.name}"?`)) {
            return;
        }

        router.delete(`/products/${product.id}`, {
            onSuccess: () => toast.success('Product deleted.'),
        });
    }

    function handleClose() {
        setShowForm(false);
        setEditing(null);
    }

    return (
        <>
            <Head title="Products" />
            <div className="p-6">
                <div className="mb-4 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Products</h1>
                    <Button
                        onClick={() => {
                            setEditing(null);
                            setShowForm(true);
                        }}
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Add Product
                    </Button>
                </div>
                <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
                    <div className="relative max-w-sm flex-1">
                        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            className="pl-9"
                            placeholder="Search by name or category..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <Select
                        value={categoryFilter}
                        onValueChange={setCategoryFilter}
                    >
                        <SelectTrigger className="w-full sm:w-52">
                            <SelectValue placeholder="All categories" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All categories</SelectItem>
                            {categories.map((category) => (
                                <SelectItem
                                    key={category.id}
                                    value={category.id.toString()}
                                >
                                    {category.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="rounded-lg border">
                    <table className="w-full text-sm">
                        <thead className="border-b bg-muted/50">
                            <tr>
                                <th className="px-4 py-3 text-left">Name</th>
                                <th className="px-4 py-3 text-left">
                                    Category
                                </th>
                                <th className="px-4 py-3 text-left">Price</th>
                                <th className="px-4 py-3 text-left">Stock</th>
                                <th className="px-4 py-3 text-left">Status</th>
                                <th className="px-4 py-3 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={6}
                                        className="px-4 py-8 text-center text-muted-foreground"
                                    >
                                        <Package className="mx-auto mb-2 h-8 w-8 opacity-40" />
                                        {products.length === 0
                                            ? 'No products yet. Click "Add Product" to get started.'
                                            : 'No products match your filters.'}
                                    </td>
                                </tr>
                            )}
                            {filtered.map((product) => (
                                <tr
                                    key={product.id}
                                    className="border-b last:border-0 hover:bg-muted/25"
                                >
                                    <td className="px-4 py-3 font-medium">
                                        {product.name}
                                    </td>
                                    <td className="px-4 py-3 text-muted-foreground">
                                        <Badge variant="secondary">
                                            {product.category.name}
                                        </Badge>
                                    </td>
                                    <td className="px-4 py-3">
                                        ${product.price}
                                    </td>
                                    <td
                                        className={`px-4 py-3 ${product.stock <= 5 ? 'font-semibold text-orange-600' : ''}`}
                                    >
                                        {product.stock}
                                        {product.stock === 0 && (
                                            <span className="ml-1 text-xs text-destructive">
                                                (Out)
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3">
                                        <Badge
                                            variant={
                                                product.is_active
                                                    ? 'default'
                                                    : 'secondary'
                                            }
                                        >
                                            {product.is_active
                                                ? 'Active'
                                                : 'Inactive'}
                                        </Badge>
                                    </td>
                                    <td className="px-4 py-3">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleEdit(product)}
                                        >
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() =>
                                                handleDelete(product)
                                            }
                                        >
                                            <Trash2 className="h-4 w-4 text-destructive" />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            {showForm && (
                <ProductForm
                    categories={categories}
                    product={editing}
                    onClose={handleClose}
                />
            )}
        </>
    );
}

ProductIndex.layout = {
    breadcrumbs: [{ title: 'Products', href: '/products' }],
};
