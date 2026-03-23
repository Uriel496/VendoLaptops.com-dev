import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { products as initialProducts } from '../constants/data';
import type { CatalogProduct } from '../constants/data';

interface ProductsStore {
  products: CatalogProduct[];
  setProducts: (products: CatalogProduct[]) => void;
  addProduct: (product: Omit<CatalogProduct, 'id'>) => void;
  updateProduct: (id: number, updates: Partial<Omit<CatalogProduct, 'id'>>) => void;
  deleteProduct: (id: number) => void;
  resetProducts: () => void;
}

export const useProductsStore = create<ProductsStore>()(
  persist(
    (set, get) => ({
      products: initialProducts,

      setProducts: (products) => {
        set({ products });
      },

      addProduct: (product) => {
        const ids = get().products.map((p) => p.id);
        const newId = ids.length > 0 ? Math.max(...ids) + 1 : 1;
        set((state) => ({
          products: [...state.products, { ...product, id: newId }],
        }));
      },

      updateProduct: (id, updates) => {
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id ? { ...p, ...updates } : p
          ),
        }));
      },

      deleteProduct: (id) => {
        set((state) => ({
          products: state.products.filter((p) => p.id !== id),
        }));
      },

      resetProducts: () => {
        set({ products: initialProducts });
      },
    }),
    { name: 'products-storage' }
  )
);
