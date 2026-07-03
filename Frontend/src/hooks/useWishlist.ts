import { useWishlist, WishlistItem, WishlistItemType } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useNavigate } from 'react-router-dom';

/**
 * Returns { isWishlisted, toggle } for a single item.
 * Requires login — redirects to /login if user is not authenticated.
 */
export function useWishlistToggle(item: Omit<WishlistItem, 'addedAt'>) {
  const { isInWishlist, toggleItem } = useWishlist();
  const { isAuthenticated } = useAuth();
  const { success } = useToast();
  const navigate = useNavigate();

  const isWishlisted = isInWishlist(item.id);

  const toggle = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: '/wishlist' } } });
      return;
    }
    toggleItem(item);
    success(isWishlisted ? `Removed from wishlist` : `Added to wishlist`);
  };

  return { isWishlisted, toggle };
}
