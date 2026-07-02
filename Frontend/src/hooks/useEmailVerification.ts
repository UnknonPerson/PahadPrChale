import { useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';

/**
 * Use this hook to gate sensitive actions (booking, reviews, messages) behind
 * email verification. When the user tries the action:
 *  1. If verified → proceed normally.
 *  2. If not verified → open the verification modal automatically.
 *
 * Usage:
 *   const { requireVerified, VerificationModal } = useEmailVerification();
 *   // ...
 *   const handleBook = requireVerified('make a booking', () => { ... actual logic ... });
 *   // ...
 *   return <>{VerificationModal}</>;
 */
export function useEmailVerification() {
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [actionName, setActionName] = useState('perform this action');

  const requireVerified = useCallback(
    (name: string, action: () => void) =>
      (...args: any[]) => {
        if ((user as any)?.isEmailVerified) {
          action(...args);
        } else {
          setActionName(name);
          setShowModal(true);
        }
      },
    [user]
  );

  return { requireVerified, showModal, setShowModal, actionName };
}
