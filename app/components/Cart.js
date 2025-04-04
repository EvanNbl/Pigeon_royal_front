// app/components/Cart.js
'use client';

import { useCart } from '../context/CartContext';
import Image from 'next/image';
import { loadStripe } from '@stripe/stripe-js';
import styles from './Cart.module.css';
import { useEffect, useRef } from 'react';

// Initialiser Stripe avec votre clé publique
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export default function Cart() {
  const { 
    cart, 
    removeFromCart, 
    updateQuantity, 
    clearCart, 
    getCartTotal, 
    isCartOpen, 
    setIsCartOpen 
  } = useCart();
  
  const cartRef = useRef(null);

  // Gestion de la fermeture du panier avec Escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isCartOpen) {
        setIsCartOpen(false);
      }
    };
    
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isCartOpen, setIsCartOpen]);

  // Empêcher le défilement du body quand le panier est ouvert
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isCartOpen]);

  // Fermer le panier en cliquant à l'extérieur
  const handleOverlayClick = (e) => {
    if (cartRef.current && !cartRef.current.contains(e.target)) {
      setIsCartOpen(false);
    }
  };

  const handleCheckout = async () => {
    // Créer une session de checkout avec Stripe
    const stripe = await stripePromise;
    
    // Transformer les produits du panier pour la requête API
    const checkoutItems = cart.map(item => ({
      name: item.name,
      description: item.description,
      price: item.price,
      image: item.image && item.image.length > 0 
        ? `${process.env.NEXT_PUBLIC_STRAPI_API_URL}${item.image[0].url}`
        : '',
      quantity: item.quantity,
    }));
    
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        items: checkoutItems
      }),
    });

    const session = await response.json();
    
    // Rediriger vers Checkout
    const result = await stripe.redirectToCheckout({
      sessionId: session.id,
    });
    
    if (result.error) {
      console.error(result.error.message);
    }
  };

  return (
    <div 
      className={`${styles.cartOverlay} ${isCartOpen ? styles.cartOverlayOpen : ''}`}
      onClick={handleOverlayClick}
    >
      <div className={styles.cartDrawer} ref={cartRef}>
        <div className={styles.cartHeader}>
          <h2>Votre panier</h2>
          <button 
            onClick={() => setIsCartOpen(false)}
            className={styles.closeButton}
            aria-label="Fermer le panier"
          >
            ✕
          </button>
        </div>

        <div className={styles.cartContent}>
          {cart.length === 0 ? (
            <div className={styles.emptyCart}>
              <div className={styles.emptyCartIcon}>🛒</div>
              <p>Votre panier est vide</p>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className={styles.cartItem}>
                {item.image && item.image.length > 0 && (
                  <div className={styles.itemImage}>
                    <Image
                      src={`${process.env.NEXT_PUBLIC_STRAPI_API_URL}${item.image[0].url}`}
                      alt={item.name}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </div>
                )}
                <div className={styles.itemDetails}>
                  <h3 className={styles.itemName}>{item.name}</h3>
                  <p className={styles.itemPrice}>{item.price} €</p>
                  
                  <div className={styles.quantityControl}>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className={styles.quantityButton}
                      disabled={item.quantity <= 1}
                    >
                      -
                    </button>
                    <span className={styles.quantityValue}>{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className={styles.quantityButton}
                    >
                      +
                    </button>
                    
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className={styles.removeButton}
                      aria-label="Supprimer l'article"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      Supprimer
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        
        {cart.length > 0 && (
          <div className={styles.cartFooter}>
            <div className={styles.cartTotal}>
              <span>Total</span>
              <span>{getCartTotal().toFixed(2)} €</span>
            </div>
            
            <div className={styles.cartButtons}>
              <button onClick={clearCart} className={styles.clearButton}>
                Vider
              </button>
              <button onClick={handleCheckout} className={styles.checkoutButton}>
                Commander
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}