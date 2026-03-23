import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useAuthStore } from './authStore';

export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface CartStore {
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (id: number) => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      cart: [],

      addToCart: (item: Omit<CartItem, 'quantity'>) => {
        if (!useAuthStore.getState().isAuthenticated) {
          if (typeof window !== 'undefined') {
            const returnTo = `${window.location.pathname}${window.location.search}${window.location.hash}`;
            const loginUrl = `/login?intent=cart&returnTo=${encodeURIComponent(returnTo)}`;
            window.location.assign(loginUrl);
          }
          return;
        }
      
        set((state) => {
          const existing = state.cart.find((i) => i.id === item.id);
          if (existing) {
            return {
              cart: state.cart.map((i) =>
                i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
              ),
            };
          }
          return {
            cart: [...state.cart, { ...item, quantity: 1 }],
          };
        });
      },
      
      removeFromCart: (id: number) => {
        set((state) => ({
          cart: state.cart.filter((i) => i.id !== id),
        }));
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);
