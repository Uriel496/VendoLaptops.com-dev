import { create } from "zustand";
import { persist } from "zustand/middleware";

export type BrandStatus = "Active" | "Inactive";

export interface BrandItem {
  id: number;
  name: string;
  products: number;
  country: string;
  status: BrandStatus;
  revenue: number;
}

const INITIAL_BRANDS: BrandItem[] = [
  { id: 1, name: "Apple", products: 12, country: "USA", status: "Active", revenue: 125000 },
  { id: 2, name: "Nike", products: 45, country: "USA", status: "Active", revenue: 87000 },
  { id: 3, name: "Samsung", products: 28, country: "Korea", status: "Active", revenue: 95000 },
  { id: 4, name: "Adidas", products: 38, country: "Germany", status: "Active", revenue: 72000 },
  { id: 5, name: "Sony", products: 20, country: "Japan", status: "Inactive", revenue: 43000 },
  { id: 6, name: "LG", products: 15, country: "Korea", status: "Active", revenue: 38000 },
];

interface BrandsStore {
  brands: BrandItem[];
  setBrands: (brands: BrandItem[]) => void;
  addBrand: (brand: Omit<BrandItem, "id">) => void;
  updateBrand: (id: number, updates: Partial<Omit<BrandItem, "id">>) => void;
  deleteBrand: (id: number) => void;
  resetBrands: () => void;
}

export const useBrandsStore = create<BrandsStore>()(
  persist(
    (set, get) => ({
      brands: INITIAL_BRANDS,

      setBrands: (brands) => {
        set({ brands });
      },

      addBrand: (brand) => {
        const ids = get().brands.map((b) => b.id);
        const nextId = ids.length > 0 ? Math.max(...ids) + 1 : 1;
        set((state) => ({ brands: [...state.brands, { id: nextId, ...brand }] }));
      },

      updateBrand: (id, updates) => {
        set((state) => ({
          brands: state.brands.map((b) => (b.id === id ? { ...b, ...updates } : b)),
        }));
      },

      deleteBrand: (id) => {
        set((state) => ({
          brands: state.brands.filter((b) => b.id !== id),
        }));
      },

      resetBrands: () => {
        set({ brands: INITIAL_BRANDS });
      },
    }),
    { name: "brands-storage" }
  )
);
