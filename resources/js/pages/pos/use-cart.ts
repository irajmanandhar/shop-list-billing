import { useMemo, useReducer, useState } from 'react';
import type { CartItem, Product } from '@/types';

type CartAction =
    | { type: 'ADD'; product: Product }
    | { type: 'REMOVE'; productId: number }
    | { type: 'SET_QTY'; productId: number; quantity: number }
    | { type: 'CLEAR' };

function cartReducer(state: CartItem[], action: CartAction): CartItem[] {
    switch (action.type) {
        case 'ADD': {
            const existing = state.find(
                (i) => i.product.id === action.product.id,
            );

            if (existing) {
                // Never exceed available stock.
                return state.map((i) =>
                    i.product.id === action.product.id
                        ? {
                              ...i,
                              quantity: Math.min(
                                  i.quantity + 1,
                                  i.product.stock,
                              ),
                          }
                        : i,
                );
            }

            return [...state, { product: action.product, quantity: 1 }];
        }
        case 'REMOVE':
            return state.filter((i) => i.product.id !== action.productId);

        case 'SET_QTY': {
            if (action.quantity <= 0) {
                return state.filter((i) => i.product.id !== action.productId);
            }

            return state.map((i) =>
                i.product.id === action.productId
                    ? {
                          ...i,
                          quantity: Math.min(action.quantity, i.product.stock),
                      }
                    : i,
            );
        }
        case 'CLEAR':
            return [];
        default:
            return state;
    }
}

/** Mirrors CheckoutController: integer cents, discount then tax. */
export function useCart(taxRate: number) {
    const [items, dispatch] = useReducer(cartReducer, []);
    const [discountPercent, setDiscountPercent] = useState(0);

    const totals = useMemo(() => {
        const subtotal = items.reduce(
            (sum, i) =>
                sum +
                Math.round(parseFloat(i.product.price) * 100) * i.quantity,
            0,
        );
        const discount = Math.round((subtotal * discountPercent) / 100);
        const tax = Math.round(((subtotal - discount) * taxRate) / 100);

        return {
            subtotal: subtotal / 100,
            discount: discount / 100,
            tax: tax / 100,
            total: (subtotal - discount + tax) / 100,
        };
    }, [items, discountPercent, taxRate]);

    return {
        items,
        totals,
        discountPercent,
        setDiscountPercent,
        count: items.reduce((n, i) => n + i.quantity, 0),
        addItem: (product: Product) => dispatch({ type: 'ADD', product }),
        removeItem: (productId: number) =>
            dispatch({ type: 'REMOVE', productId }),
        setQuantity: (productId: number, quantity: number) =>
            dispatch({ type: 'SET_QTY', productId, quantity }),
        clear: () => {
            dispatch({ type: 'CLEAR' });
            setDiscountPercent(0);
        },
    };
}
