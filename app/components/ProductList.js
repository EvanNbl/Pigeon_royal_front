// app/components/ProductList.js
'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '../context/CartContext';
import styles from './ProductList.module.css';
import ColorSelector from './ColorSelector';
import SizeSelector from './SizeSelector';

export default function ProductList({ products, showVariants = false }) {
  const [loadingId, setLoadingId] = useState(null);
  const [expandedProduct, setExpandedProduct] = useState(null);
  const [selectedVariants, setSelectedVariants] = useState({});
  const { addToCart } = useCart();

  // Initialiser les variantes sélectionnées
  const initVariant = (product) => {
    if (!selectedVariants[product.id]) {
      const newVariants = { ...selectedVariants };
      newVariants[product.id] = {
        selectedColor: product.colors && product.colors.length > 0 ? product.colors[0] : null,
        selectedSize: product.sizes && product.sizes.length > 0 ? product.sizes[0] : null
      };
      setSelectedVariants(newVariants);
    }
  };

  // Gérer le changement de couleur pour un produit
  const handleColorChange = (product, color) => {
    const newVariants = { ...selectedVariants };
    if (!newVariants[product.id]) {
      newVariants[product.id] = { selectedSize: null };
    }
    newVariants[product.id].selectedColor = color;
    setSelectedVariants(newVariants);
  };

  // Gérer le changement de taille pour un produit
  const handleSizeChange = (product, size) => {
    const newVariants = { ...selectedVariants };
    if (!newVariants[product.id]) {
      newVariants[product.id] = { selectedColor: null };
    }
    newVariants[product.id].selectedSize = size;
    setSelectedVariants(newVariants);
  };

  function handleAddToCart(e, product) {
    // Empêcher la navigation quand on clique sur le bouton
    e.preventDefault();
    e.stopPropagation();
    
    setLoadingId(product.id);
    
    // Récupérer les variantes sélectionnées pour ce produit
    const variantInfo = selectedVariants[product.id] || {
      selectedColor: product.colors && product.colors.length > 0 ? product.colors[0] : null,
      selectedSize: product.sizes && product.sizes.length > 0 ? product.sizes[0] : null
    };
    
    // Créer le produit avec les variantes
    const productWithVariants = {
      ...product,
      selectedColor: variantInfo.selectedColor,
      selectedSize: variantInfo.selectedSize,
      variantId: `${product.id}_${variantInfo.selectedColor?.id || 'no-color'}_${variantInfo.selectedSize?.id || 'no-size'}`
    };
    
    // Simuler un petit délai pour le feedback visuel
    setTimeout(() => {
      addToCart(productWithVariants);
      setLoadingId(null);
    }, 300);
  }

  // Fonction pour afficher/masquer les options de variantes
  const toggleVariants = (e, productId) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Initialiser les variantes si nécessaire
    const product = products.find(p => p.id === productId);
    if (product) {
      initVariant(product);
    }
    
    setExpandedProduct(expandedProduct === productId ? null : productId);
  };

  // Fonction pour tronquer le texte
  const truncateText = (text, maxLength) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
  };

  return (
    <div className={styles.productGrid}>
      {products.map((product) => (
        <div key={product.id} className={styles.productContainer}>
          <Link 
            href={`/product/${product.documentId || product.id}`}
            className={styles.productLink}
          >
            <div className={styles.productCard}>
              {product.image && product.image.length > 0 && (
                <div className={styles.imageContainer}>
                  <Image
                    src={`${process.env.NEXT_PUBLIC_STRAPI_API_URL}${product.image[0]?.url}`}
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className={styles.productImage}
                    style={{ objectFit: 'cover' }}
                  />
                </div>
              )}
              <div className={styles.productInfo}>
                <h2 className={styles.productName}>{product.name}</h2>
                <p className={styles.productDescription}>
                  {truncateText(product.description, 100)}
                </p>
                <p className={styles.productPrice}>{product.price} €</p>
                
                {/* Bouton pour afficher les variantes */}
                {showVariants && (
                  (product.colors && product.colors.length > 0) || 
                  (product.sizes && product.sizes.length > 0)
                ) && (
                  <button
                    onClick={(e) => toggleVariants(e, product.id)}
                    className={styles.variantButton}
                  >
                    <span>{expandedProduct === product.id ? 'Masquer les options' : 'Personnaliser'}</span>
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className={`h-5 w-5 transition-transform ${expandedProduct === product.id ? 'rotate-180' : ''}`} 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                )}
                
                <button
                  onClick={(e) => handleAddToCart(e, product)}
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
          </Link>
          
          {/* Panneau des variantes */}
          {showVariants && expandedProduct === product.id && (
            <div className={styles.variantsPanel}>
              {product.colors && product.colors.length > 0 && (
                <ColorSelector 
                  colors={product.colors} 
                  selectedColor={selectedVariants[product.id]?.selectedColor || product.colors[0]} 
                  onChange={(color) => handleColorChange(product, color)} 
                />
              )}
              
              {product.sizes && product.sizes.length > 0 && (
                <SizeSelector 
                  sizes={product.sizes} 
                  selectedSize={selectedVariants[product.id]?.selectedSize || product.sizes[0]} 
                  onChange={(size) => handleSizeChange(product, size)} 
                />
              )}
              
              <button
                onClick={(e) => handleAddToCart(e, product)}
                disabled={loadingId === product.id}
                className={styles.panelAddButton}
              >
                {loadingId === product.id ? 'Ajout en cours...' : 'Ajouter au panier avec ces options'}
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}