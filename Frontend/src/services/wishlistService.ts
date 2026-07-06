import api from './api';

export interface WishlistItemRow {
  _id?: string;
  itemId: string;
  itemType: 'package' | 'hotel' | 'destination' | 'vehicle';
  name: string;
  image?: string | null;
  price?: number | null;
  priceLabel?: string | null;
  destination?: string | null;
  description?: string | null;
  createdAt?: string;
}

// All methods call the Express /api/wishlist endpoints.
// The api.js interceptor already unwraps response.data → { success, message, data }
// so each call returns the full body. We extract .data.items / .data.item below.

const wishlistService = {
  getAll: async (): Promise<WishlistItemRow[]> => {
    const payload: any = await api.get('/wishlist');
    return payload?.data?.items ?? payload?.items ?? [];
  },

  add: async (item: Omit<WishlistItemRow, '_id' | 'createdAt'>): Promise<WishlistItemRow> => {
    const payload: any = await api.post('/wishlist', item);
    return payload?.data?.item ?? payload?.item ?? item;
  },

  remove: async (itemId: string): Promise<void> => {
    await api.delete(`/wishlist/${encodeURIComponent(itemId)}`);
  },

  clear: async (): Promise<void> => {
    await api.delete('/wishlist/clear');
  },
};

export default wishlistService;
