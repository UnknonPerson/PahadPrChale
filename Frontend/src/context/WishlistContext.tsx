import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useAuth } from './AuthContext';

// ─── Types ────────────────────────────────────────────────────────────────────

export type WishlistItemType = 'package' | 'destination' | 'hotel' | 'vehicle';

export interface WishlistItem {
  id: string;
  type: WishlistItemType;
  name: string;
  image?: string;
  price?: number;
  priceLabel?: string;  // e.g. "/night", "/day"
  destination?: string;
  description?: string;
  addedAt: string;
}

interface WishlistContextType {
  items: WishlistItem[];
  itemCount: number;
  addItem: (item: Omit<WishlistItem, 'addedAt'>) => void;
  removeItem: (id: string) => void;
  toggleItem: (item: Omit<WishlistItem, 'addedAt'>) => void;
  isInWishlist: (id: string) => boolean;
  clearWishlist: () => void;
  // Legacy helpers (string-only operations kept for backwards compat)
  wishlist: string[];
  addToWishlist: (id: string) => void;
  removeFromWishlist: (id: string) => void;
  toggleWishlist: (id: string) => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

function storageKey(userId?: string) {
  return userId ? `wishlist_v2_${userId}` : 'wishlist_v2_guest';
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const uid = (user as any)?._id || (user as any)?.id;
  const key = storageKey(uid);

  const [items, setItems] = useState<WishlistItem[]>(() => {
    try { return JSON.parse(localStorage.getItem(key) || '[]'); }
    catch { return []; }
  });

  // Re-load when user changes (login/logout)
  useEffect(() => {
    try { setItems(JSON.parse(localStorage.getItem(key) || '[]')); }
    catch { setItems([]); }
  }, [key]);

  // Persist on change
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(items));
  }, [items, key]);

  const addItem = useCallback((item: Omit<WishlistItem, 'addedAt'>) => {
    setItems((prev) =>
      prev.some((i) => i.id === item.id)
        ? prev
        : [...prev, { ...item, addedAt: new Date().toISOString() }]
    );
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const toggleItem = useCallback((item: Omit<WishlistItem, 'addedAt'>) => {
    setItems((prev) =>
      prev.some((i) => i.id === item.id)
        ? prev.filter((i) => i.id !== item.id)
        : [...prev, { ...item, addedAt: new Date().toISOString() }]
    );
  }, []);

  const isInWishlist = useCallback((id: string) => items.some((i) => i.id === id), [items]);

  const clearWishlist = useCallback(() => setItems([]), []);

  // Legacy string-array helpers
  const wishlist = items.map((i) => i.id);
  const addToWishlist    = (id: string) => { /* No-op without full item data — use addItem */ };
  const removeFromWishlist = removeItem;
  const toggleWishlist   = (id: string) => removeItem(id); // partial toggle without data

  return (
    <WishlistContext.Provider value={{
      items,
      itemCount: items.length,
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
