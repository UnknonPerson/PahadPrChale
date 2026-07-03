import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export interface WishlistItemRow {
  id?: string;
  user_id: string;
  item_id: string;
  item_type: 'package' | 'hotel' | 'destination' | 'vehicle';
  name: string;
  image?: string | null;
  price?: number | null;
  price_label?: string | null;
  destination?: string | null;
  description?: string | null;
  added_at?: string;
}

const wishlistService = {
  /** Fetch all wishlist items for a user */
  getAll: async (userId: string): Promise<WishlistItemRow[]> => {
    const { data, error } = await supabase
      .from('wishlist_items')
      .select('*')
      .eq('user_id', userId)
      .order('added_at', { ascending: false });
    if (error) throw error;
    return data ?? [];
  },

  /** Add a new item (upsert — safe if already exists) */
  add: async (item: WishlistItemRow): Promise<WishlistItemRow> => {
    const { data, error } = await supabase
      .from('wishlist_items')
      .upsert(item, { onConflict: 'user_id,item_id' })
      .select()
      .maybeSingle();
    if (error) throw error;
    return data as WishlistItemRow;
  },

  /** Remove a single item by item_id + user_id */
  remove: async (userId: string, itemId: string): Promise<void> => {
    const { error } = await supabase
      .from('wishlist_items')
      .delete()
      .eq('user_id', userId)
      .eq('item_id', itemId);
    if (error) throw error;
  },

  /** Remove all items for a user */
  clear: async (userId: string): Promise<void> => {
    const { error } = await supabase
      .from('wishlist_items')
      .delete()
      .eq('user_id', userId);
    if (error) throw error;
  },
};

export default wishlistService;
