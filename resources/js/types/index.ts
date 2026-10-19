export type * from './auth';
export type * from './navigation';
export type * from './ui';

export interface Category {
    id: number;
    name: string;
    description: string | null;
}

export interface Product {
    id: number;
    category_id: number;
    name: string;
    description: string | null;
    price: string;
    stock: number;
    image: string | null;
    image_url: string | null;
    is_active: boolean;
    category: Category;
}

export interface CartItem {
    product: Product;
    quantity: number;
}

export interface SaleItem {
    id: number;
    product_name: string;
    unit_price: string;
    quantity: number;
    subtotal: string;
}

export interface Sale {
    id: number;
    total: string;
    cash_tendered: string;
    change_amount: string;
    subtotal: string;
    discount: string;
    tax: string;
    payment_method: 'cash' | 'card';
    status: 'completed' | 'voided';
    created_at: string;
    user?: { id: number; name: string } | null;
    items: SaleItem[];
}
