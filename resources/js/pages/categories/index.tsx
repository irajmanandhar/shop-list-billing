import { Head, Link, router, useForm } from '@inertiajs/react';
import { Pencil, Plus, ShoppingCart, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { Category } from '@/types';

// Create a TypeScript type intersection combining Category with an added products_count property
type CategoryWithCount = Category & { products_count: number };

// Define the component's props interface expected from Inertia backend
interface Props {
    categories: CategoryWithCount[]; // Array of categories including their product counts
}

// Main component function accepting categories prop typed with Props interface
export default function CategoryIndex({ categories }: Props) {
    // State variable to control the visibility/modal state of the category form (defaults to hidden/false)
    const [showForm, setShowForm] = useState(false);

    // State variable to track which category is being edited, or null if creating new (defaults to null)
    const [editing, setEditing] = useState<Category | null>(null);

    // Initialize Inertia form helper with default field values and destructure helper functions/state
    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: '', // Initial empty string value for category name
        description: '', // Initial empty string value for category description
    });

    function openCreate() {
        reset();
        setEditing(null);
        setShowForm(true);
    }

    function openEdit(cat: Category) {
        setData({ name: cat.name, description: cat.description ?? '' });
        setEditing(cat);
        setShowForm(true);
    }

    function closeForm() {
        reset();
        setShowForm(false);
        setEditing(null);
    }

    function submit(e: React.FormEvent) {
        e.preventDefault();

        if (editing) {
            put(`/categories/${editing.id}`, {
                onSuccess: () => {
                    toast.success('Category updated.');
                    closeForm();
                },
            });
        } else {
            post('/categories', {
                onSuccess: () => {
                    toast.success('Category created.');
                    closeForm();
                },
            });
        }
    }

    function handleDelete(cat: CategoryWithCount) {
        if (cat.products_count > 0) {
            toast.error(
                `Cannot delete "${cat.name}" – it has ${cat.products_count} product(s). Reassign them first.`,
            );

            return;
        }

        if (!confirm(`Delete category "${cat.name}"?`)) {
            return;
        }

        router.delete(`/categories/${cat.id}`, {
            onSuccess: () => toast.success('Category deleted.'),
        });
    }

    return (
        <>
            <Head title="Categories" />
            <div className="p-6">
                <div className="mb-4 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Categories</h1>
                    <Button onClick={openCreate}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Category
                    </Button>
                </div>
                <div className="rounded-lg border">
                    <table className="w-full text-sm">
                        <thead className="border-b bg-muted/50">
                            <tr>
                                <th className="px-4 py-3 text-left">Name</th>
                                <th className="px-4 py-3 text-left">
                                    Description
                                </th>
                                <th className="px-4 py-3 text-right">
                                    Products
                                </th>
                                <th className="px-4 py-3 text-right">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {categories.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={4}
                                        className="px-4 py-8 text-center text-muted-foreground"
                                    >
                                        No categories yet. Add one to get
                                        started.
                                    </td>
                                </tr>
                            )}
                            {categories.map((cat) => (
                                <tr
                                    key={cat.id}
                                    className="border-b last:border-0 hover:bg-muted/25"
                                >
                                    <td className="px-4 py-3 font-medium">
                                        {cat.name}
                                    </td>
                                    <td className="px-4 py-3 text-muted-foreground">
                                        {cat.description ?? '-'}
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        {cat.products_count}
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => openEdit(cat)}
                                        >
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleDelete(cat)}
                                        >
                                            <Trash2 className="h-4 w-4 text-destructive" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            asChild
                                        >
                                            <Link
                                                href={`/pos?category=${cat.id}`}
                                                title={`Sell ${cat.name} in POS`}
                                            >
                                                <ShoppingCart className="h-4 w-4 text-emerald-600" />
                                            </Link>
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* dialog */}
            <Dialog open={showForm} onOpenChange={closeForm}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {editing ? 'Edit Category' : 'Add Category'}
                        </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={submit} className="space-y-4">
                        <div>
                            <Label htmlFor="cat-name">Name</Label>
                            <Input
                                id="cat-name"
                                value={data.name}
                                onChange={(e) =>
                                    setData('name', e.target.value)
                                }
                            />
                            <InputError message={errors.name} />
                        </div>
                        <div>
                            <Label htmlFor="cat-desc">
                                Description (optional)
                            </Label>
                            <Input
                                id="cat-desc"
                                value={data.description}
                                onChange={(e) =>
                                    setData('description', e.target.value)
                                }
                            />
                            <InputError message={errors.description} />
                        </div>
                        <div className="flex justify-end gap-2 pt-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={closeForm}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={processing}>
                                {processing
                                    ? 'Saving...'
                                    : editing
                                      ? 'Update'
                                      : 'Create'}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}

CategoryIndex.layout = {
    breadcrumbs: [{ title: 'Categories', href: '/categories' }],
};
