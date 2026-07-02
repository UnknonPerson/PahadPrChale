import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';

interface WishlistContextType {
  wishlist: string[];
  addToWishlist: (id: string) => void;
  removeFromWishlist: (id: string) => void;
  toggleWishlist: (id: string) => void;
  isInWishlist: (id: string) => boolean;
  clearWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

function storageKey(userId: string | undefined) {
  return userId ? `wishlist_${userId}` : 'wishlist_guest';
}

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const key = storageKey(user?._id || (user as any)?.id);

  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(key) || '[]');
    } catch {
      return [];
    }
  });

  // Re-load when user changes (login / logout)
  useEffect(() => {
    try {
      setWishlist(JSON.parse(localStorage.getItem(key) || '[]'));
    } catch {
      setWishlist([]);
    }
  }, [key]);

  // Persist on change
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(wishlist));
  }, [wishlist, key]);

  const addToWishlist = (id: string) =>
    setWishlist((prev) => (prev.includes(id) ? prev : [...prev, id]));

  const removeFromWishlist = (id: string) =>
    setWishlist((prev) => prev.filter((i) => i !== id));

  const toggleWishlist = (id: string) =>
    setWishlist((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );

  const isInWishlist = (id: string) => wishlist.includes(id);

  const clearWishlist = () => setWishlist([]);

  return (
    <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, toggleWishlist, isInWishlist, clearWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used inside WishlistProvider');
  return ctx;
}
