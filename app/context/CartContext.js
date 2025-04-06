// app/context/CartContext.js
'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Charger le panier depuis localStorage au chargement
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error parsing cart from localStorage', error);
      }
    }
  }, []);

  // Sauvegarder le panier dans localStorage à chaque modification
  useEffect(() => {
    if (cart.length > 0) {
      localStorage.setItem('cart', JSON.stringify(cart));
    } else {
      localStorage.removeItem('cart');
    }
  }, [cart]);

  // Ajouter un produit au panier avec une quantité spécifiée
  const addToCart = (product, quantity = 1) => {
    setCart((prevCart) => {
      // Identifier unique pour la variante du produit 
      const productId = product.variantId || product.id;
      
      // Vérifier si le produit est déjà dans le panier
      const existingItemIndex = prevCart.findIndex(item => 
        (item.variantId && item.variantId === productId) || 
        (!item.variantId && item.id === productId)
      );
      
      if (existingItemIndex > -1) {
        // Augmenter la quantité si le produit existe déjà
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex] = {
          ...updatedCart[existingItemIndex],
          quantity: updatedCart[existingItemIndex].quantity + quantity
        };
        return updatedCart;
      } else {
        // Ajouter le nouveau produit avec la quantité spécifiée
        return [...prevCart, { ...product, quantity: quantity }];
      }
    });
  };

  // Supprimer un produit du panier
  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter(item => 
      (item.variantId && item.variantId !== productId) || 
      (!item.variantId && item.id !== productId)
    ));
  };

  // Mettre à jour la quantité d'un produit
  const updateQuantity = (productId, quantity) => {
    if (quantity < 1) return;
    
    setCart((prevCart) => 
      prevCart.map(item => {
        const itemId = item.variantId || item.id;
        return itemId === productId ? { ...item, quantity } : item;
      })
    );
  };

  // Vider le panier
  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('cart');
  };

  // Calculer le total du panier
  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  // Calculer le nombre total d'articles
  const getCartItemsCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  // Valeurs exposées par le contexte
  const value = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemsCount,
    isCartOpen,
    setIsCartOpen
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};