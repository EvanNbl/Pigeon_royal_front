// app/components/ProductList.js
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useCart } from '../context/CartContext';
import styles from './ProductList.module.css';

export default function ProductList({ products }) {
  const [loadingId, setLoadingId] = useState(null);
  const { addToCart } = useCart();

  function handleAddToCart(product) {
    setLoadingId(product.id);
    
    // Simuler un petit délai pour le feedback visuel
    setTimeout(() => {
      addToCart(product);
      setLoadingId(null);
    }, 300);
  }

  return (
    <div className={styles.productGrid}>
      {products.map((product) => (
        <div key={product.id} className={styles.productCard}>
          {product.image && product.image.length > 0 && (
            <div className={styles.imageContainer}>
              <Image
                src={`${process.env.NEXT_PUBLIC_STRAPI_API_URL}${product.image[0].url}`}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover"
              />
            </div>
          )}
          <div className={styles.productInfo}>
            <h2 className={styles.productName}>{product.name}</h2>
            <p className={styles.productDescription}>{product.description}</p>
            <p className={styles.productPrice}>{product.price} €</p>
            <button
              onClick={() => handleAddToCart(product)}
              disabled={loadingId === product.id}
              className={styles.addButton}
            >
              {loadingId === product.id ? (
                'Ajout en cours...'
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Ajouter au panier
                </>
              )}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}