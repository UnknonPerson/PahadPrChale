import {
  createContext, useContext, useState, useEffect, useCallback, ReactNode,
} from 'react';
import { useAuth } from './AuthContext';
import wishlistService, { WishlistItemRow } from '../services/wishlistService';

// ─── Public types ─────────────────────────────────────────────────────────────

export type WishlistItemType = 'package' | 'destination' | 'hotel' | 'vehicle';

export interface WishlistItem {
  id: string;        // item_id from the DB row (MongoDB _id of the resource)
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
  // Legacy helpers kept for backwards compatibility
  wishlist: string[];
  addToWishlist: (id: string) => void;
  removeFromWishlist: (id: string) => void;
  toggleWishlist: (id: string) => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

// ─── Row <-> WishlistItem conversions ─────────────────────────────────────────

function rowToItem(row: WishlistItemRow): WishlistItem {
  return {
    id:          row.item_id,
    type:        row.item_type,
    name:        row.name,
    image:       row.image ?? undefined,
    price:       row.price ?? undefined,
    priceLabel:  row.price_label ?? undefined,
    destination: row.destination ?? undefined,
    description: row.description ?? undefined,
    addedAt:     row.added_at || new Date().toISOString(),
  };
}

function itemToRow(userId: string, item: Omit<WishlistItem, 'addedAt'>): WishlistItemRow {
  return {
    user_id:    userId,
    item_id:    item.id,
    item_type:  item.type,
    name:       item.name,
    image:      item.image ?? null,
    price:      item.price ?? null,
    price_label: item.priceLabel ?? null,
    destination: item.destination ?? null,
    description: item.description ?? null,
  };
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { user, isAuthenticated } = useAuth();
  const userId = (user as any)?._id || (user as any)?.id || null;

  const [items, setItems]     = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [synced, setSynced]   = useState(false);

  // Load from Supabase when user logs in
  useEffect(() => {
    if (!userId || !isAuthenticated) {
      setItems([]);
      setSynced(false);
      return;
    }
    setLoading(true);
    wishlistService.getAll(userId)
      .then((rows) => {
        setItems(rows.map(rowToItem));
        setSynced(true);
      })
      .catch(() => {
        // Graceful fallback — leave items empty, don't crash
      })
      .finally(() => setLoading(false));
  }, [userId, isAuthenticated]);

  // ── Add ──────────────────────────────────────────────────────────────────

  const addItem = useCallback(async (item: Omit<WishlistItem, 'addedAt'>) => {
    if (items.some((i) => i.id === item.id)) return; // already in list
    // Optimistic update
    const optimistic: WishlistItem = { ...item, addedAt: new Date().toISOString() };
    setItems((prev) => [optimistic, ...prev]);
    if (userId) {
      try {
        const row = await wishlistService.add(itemToRow(userId, item));
        // Replace optimistic with confirmed row (has real `added_at`)
        setItems((prev) => prev.map((i) => (i.id === item.id ? rowToItem(row) : i)));
      } catch {
        // Rollback on failure
        setItems((prev) => prev.filter((i) => i.id !== item.id));
      }
    }
  }, [items, userId]);

  // ── Remove ───────────────────────────────────────────────────────────────

  const removeItem = useCallback(async (id: string) => {
    const prev = items;
    setItems((p) => p.filter((i) => i.id !== id));
    if (userId) {
      try {
        await wishlistService.remove(userId, id);
      } catch {
        setItems(prev); // Rollback
      }
    }
  }, [items, userId]);

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
    const prev = items;
    setItems([]);
    if (userId) {
      try {
        await wishlistService.clear(userId);
      } catch {
        setItems(prev);
      }
    }
  }, [items, userId]);

  // ── isInWishlist ──────────────────────────────────────────────────────────

  const isInWishlist = useCallback((id: string) => items.some((i) => i.id === id), [items]);

  // Legacy helpers
  const wishlist            = items.map((i) => i.id);
  const addToWishlist       = () => {}; // No-op — needs full item data; use addItem
  const removeFromWishlist  = (id: string) => { removeItem(id); };
  const toggleWishlist      = (id: string) => { removeItem(id); };

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
