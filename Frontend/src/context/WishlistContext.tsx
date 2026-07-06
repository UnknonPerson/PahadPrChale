import {
  createContext, useContext, useState, useEffect, useCallback, ReactNode,
} from 'react';
import { useAuth } from './AuthContext';
import wishlistService from '../services/wishlistService';

// ─── Types ────────────────────────────────────────────────────────────────────

export type WishlistItemType = 'package' | 'destination' | 'hotel' | 'vehicle';

export interface WishlistItem {
  id: string;          // = itemId on the DB row
  type: WishlistItemType;
  name: string;
  image?: string;
  price?: number;
  priceLabel?: string;
  destination?: string;
  description?: string;
  addedAt: string;
}

interface WishlistContextType {
  items: WishlistItem[];
  itemCount: number;
  loading: boolean;
  addItem: (item: Omit<WishlistItem, 'addedAt'>) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  toggleItem: (item: Omit<WishlistItem, 'addedAt'>) => Promise<void>;
  isInWishlist: (id: string) => boolean;
  clearWishlist: () => Promise<void>;
  // Legacy helpers
  wishlist: string[];
  addToWishlist: (id: string) => void;
  removeFromWishlist: (id: string) => void;
  toggleWishlist: (id: string) => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

// ─── Helpers ──────────────────────────────────────────────────────────────────

function rowToItem(row: any): WishlistItem {
  return {
    id:          row.itemId,
    type:        row.itemType,
    name:        row.name,
    image:       row.image || undefined,
    price:       row.price ?? undefined,
    priceLabel:  row.priceLabel || undefined,
    destination: row.destination || undefined,
    description: row.description || undefined,
    addedAt:     row.createdAt || new Date().toISOString(),
  };
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();

  const [items, setItems]     = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(false);

  // Load from backend on login; clear on logout
  useEffect(() => {
    if (!isAuthenticated) {
      setItems([]);
      return;
    }
    setLoading(true);
    wishlistService.getAll()
      .then((rows) => setItems(rows.map(rowToItem)))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, [isAuthenticated]);

  // ── Add ───────────────────────────────────────────────────────────────────

  const addItem = useCallback(async (item: Omit<WishlistItem, 'addedAt'>) => {
    if (items.some((i) => i.id === item.id)) return;
    const optimistic: WishlistItem = { ...item, addedAt: new Date().toISOString() };
    setItems((prev) => [optimistic, ...prev]);
    try {
      const saved = await wishlistService.add({
        itemId:      item.id,
        itemType:    item.type,
        name:        item.name,
        image:       item.image ?? null,
        price:       item.price ?? null,
        priceLabel:  item.priceLabel ?? null,
        destination: item.destination ?? null,
        description: item.description ?? null,
      });
      setItems((prev) =>
        prev.map((i) => (i.id === item.id ? rowToItem(saved) : i))
      );
    } catch {
      setItems((prev) => prev.filter((i) => i.id !== item.id));
    }
  }, [items]);

  // ── Remove ────────────────────────────────────────────────────────────────

  const removeItem = useCallback(async (id: string) => {
    const snapshot = items;
    setItems((p) => p.filter((i) => i.id !== id));
    try {
      await wishlistService.remove(id);
    } catch {
      setItems(snapshot);
    }
  }, [items]);

  // ── Toggle ────────────────────────────────────────────────────────────────

  const toggleItem = useCallback(async (item: Omit<WishlistItem, 'addedAt'>) => {
    if (items.some((i) => i.id === item.id)) {
      await removeItem(item.id);
    } else {
      await addItem(item);
    }
  }, [items, addItem, removeItem]);

  // ── Clear ─────────────────────────────────────────────────────────────────

  const clearWishlist = useCallback(async () => {
    const snapshot = items;
    setItems([]);
    try {
      await wishlistService.clear();
    } catch {
      setItems(snapshot);
    }
  }, [items]);

  // ── isInWishlist ──────────────────────────────────────────────────────────

  const isInWishlist = useCallback((id: string) => items.some((i) => i.id === id), [items]);

  // Legacy string helpers
  const wishlist           = items.map((i) => i.id);
  const addToWishlist      = () => {};
  const removeFromWishlist = (id: string) => { removeItem(id); };
  const toggleWishlist     = (id: string) => { removeItem(id); };

  return (
    <WishlistContext.Provider value={{
      items,
      itemCount: items.length,
      loading,
      addItem,
      removeItem,
      toggleItem,
      isInWishlist,
      clearWishlist,
      wishlist,
      addToWishlist,
      removeFromWishlist,
      toggleWishlist,
    }}>
      {children}
    </WishlistContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used inside WishlistProvider');
  return ctx;
}
