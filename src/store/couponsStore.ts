import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CouponStatus = "Active" | "Expired";

export interface CouponItem {
  id: number;
  code: string;
  discount: string;
  type: "Percentage" | "Fixed";
  minOrder: number;
  uses: number;
  maxUses: number;
  expires: string;
  status: CouponStatus;
}

const INITIAL_COUPONS: CouponItem[] = [
  { id: 1, code: "SAVE10", discount: "10%", type: "Percentage", minOrder: 50, uses: 142, maxUses: 500, expires: "31-03-2025", status: "Active" },
  { id: 2, code: "FLAT20", discount: "$20", type: "Fixed", minOrder: 100, uses: 89, maxUses: 200, expires: "28-02-2025", status: "Active" },
  { id: 3, code: "WELCOME5", discount: "5%", type: "Percentage", minOrder: 0, uses: 310, maxUses: 1000, expires: "31-12-2025", status: "Active" },
  { id: 4, code: "SUMMER30", discount: "30%", type: "Percentage", minOrder: 75, uses: 200, maxUses: 200, expires: "15-01-2025", status: "Expired" },
  { id: 5, code: "VIP50", discount: "$50", type: "Fixed", minOrder: 200, uses: 12, maxUses: 50, expires: "30-06-2025", status: "Active" },
];

interface CouponsStore {
  coupons: CouponItem[];
  setCoupons: (coupons: CouponItem[]) => void;
  addCoupon: (coupon: Omit<CouponItem, "id" | "uses">) => void;
  updateCoupon: (id: number, updates: Partial<Omit<CouponItem, "id">>) => void;
  deleteCoupon: (id: number) => void;
  resetCoupons: () => void;
}

export const useCouponsStore = create<CouponsStore>()(
  persist(
    (set, get) => ({
      coupons: INITIAL_COUPONS,

      setCoupons: (coupons) => {
        set({ coupons });
      },

      addCoupon: (coupon) => {
        const ids = get().coupons.map((c) => c.id);
        const nextId = ids.length > 0 ? Math.max(...ids) + 1 : 1;
        set((state) => ({
          coupons: [...state.coupons, { id: nextId, uses: 0, ...coupon }],
        }));
      },

      updateCoupon: (id, updates) => {
        set((state) => ({
          coupons: state.coupons.map((c) => (c.id === id ? { ...c, ...updates } : c)),
        }));
      },

      deleteCoupon: (id) => {
        set((state) => ({
          coupons: state.coupons.filter((c) => c.id !== id),
        }));
      },

      resetCoupons: () => {
        set({ coupons: INITIAL_COUPONS });
      },
    }),
    { name: "coupons-storage" }
  )
);
