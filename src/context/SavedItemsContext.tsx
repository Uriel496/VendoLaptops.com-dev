import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";

export type DrawerType = "favorites" | "compare";

export interface SavedItem {
  key: string;
  id?: number;
  name: string;
  price: number;
  image?: string;
  route?: string;
}

interface SavedItemsContextType {
  favorites: SavedItem[];
  compared: SavedItem[];
  activeDrawer: DrawerType | null;
  openDrawer: (type: DrawerType) => void;
  closeDrawer: () => void;
  isFavorite: (key: string) => boolean;
  isCompared: (key: string) => boolean;
  toggleFavorite: (item: SavedItem) => boolean;
  toggleCompare: (item: SavedItem) => boolean;
  removeFavorite: (key: string) => void;
  removeCompare: (key: string) => void;
}

const SavedItemsContext = createContext<SavedItemsContextType | undefined>(undefined);

const FAVORITES_STORAGE_KEY = "vendo-favorites";
const COMPARE_STORAGE_KEY = "vendo-compare";

const readStorageItems = (storageKey: string): SavedItem[] => {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(storageKey);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as SavedItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export function SavedItemsProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<SavedItem[]>(() => readStorageItems(FAVORITES_STORAGE_KEY));
  const [compared, setCompared] = useState<SavedItem[]>(() => readStorageItems(COMPARE_STORAGE_KEY));
  const [activeDrawer, setActiveDrawer] = useState<DrawerType | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
    }
  }, [favorites]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(COMPARE_STORAGE_KEY, JSON.stringify(compared));
    }
  }, [compared]);

  const value = useMemo<SavedItemsContextType>(() => {
    const isFavorite = (key: string) => favorites.some((item) => item.key === key);
    const isCompared = (key: string) => compared.some((item) => item.key === key);

    const toggleFavorite = (item: SavedItem) => {
      const exists = favorites.some((saved) => saved.key === item.key);
      setFavorites((prev) => (exists ? prev.filter((saved) => saved.key !== item.key) : [item, ...prev]));
      return !exists;
    };

    const toggleCompare = (item: SavedItem) => {
      const exists = compared.some((saved) => saved.key === item.key);
      setCompared((prev) => (exists ? prev.filter((saved) => saved.key !== item.key) : [item, ...prev]));
      return !exists;
    };

    const removeFavorite = (key: string) => {
      setFavorites((prev) => prev.filter((item) => item.key !== key));
    };

    const removeCompare = (key: string) => {
      setCompared((prev) => prev.filter((item) => item.key !== key));
    };

    return {
      favorites,
      compared,
      activeDrawer,
      openDrawer: (type: DrawerType) => setActiveDrawer(type),
      closeDrawer: () => setActiveDrawer(null),
      isFavorite,
      isCompared,
      toggleFavorite,
      toggleCompare,
      removeFavorite,
      removeCompare,
    };
  }, [activeDrawer, compared, favorites]);

  return <SavedItemsContext.Provider value={value}>{children}</SavedItemsContext.Provider>;
}

export function useSavedItems() {
  const context = useContext(SavedItemsContext);
  if (!context) {
    throw new Error("useSavedItems must be used within SavedItemsProvider");
  }
  return context;
}
