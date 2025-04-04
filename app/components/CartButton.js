// app/components/CartButton.js
'use client';

import { useCart } from '../context/CartContext';
import { useEffect, useState } from 'react';
import styles from './CartButton.module.css';

export default function CartButton() {
  const { getCartItemsCount, setIsCartOpen } = useCart();
  const [animate, setAnimate] = useState(false);
  const [prevCount, setPrevCount] = useState(0);
  const cartCount = getCartItemsCount();
  
  // Animation quand le nombre d'items change
  useEffect(() => {
    if (cartCount > prevCount) {
      setAnimate(true);
      const timer = setTimeout(() => setAnimate(false), 500);
      return () => clearTimeout(timer);
    }
    setPrevCount(cartCount);
  }, [cartCount, prevCount]);
  
  return (
    <button
      onClick={() => setIsCartOpen(true)}
      className={styles.cartButton}
      aria-label={`Ouvrir le panier, ${cartCount} articles`}
    >
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
      
      {cartCount > 0 && (
        <span className={`${styles.badge} ${animate ? styles.badgeAnimated : ''}`}>
          {cartCount}
        </span>
      )}
    </button>
  );
}