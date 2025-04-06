// app/components/ProductDetail.js (version modifiée)
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '../context/CartContext';
import styles from './ProductDetail.module.css';
import ColorSelector from './ColorSelector';
import SizeSelector from './SizeSelector';

export default function ProductDetail({ product }) {
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const { addToCart } = useCart();

  // Logging pour debug
  console.log("Product received in ProductDetail:", product);

  // Définir la couleur et la taille par défaut au chargement
  useEffect(() => {
    if (product.colors && product.colors.length > 0) {
      setSelectedColor(product.colors[0]);
    }
    if (product.sizes && product.sizes.length > 0) {
      setSelectedSize(product.sizes[0]);
    }
  }, [product]);

  function handleAddToCart() {
    setLoading(true);
    
    // Créer une variante de produit avec les options sélectionnées
    const productVariant = {
      ...product,
      selectedColor: selectedColor,
      selectedSize: selectedSize,
      variantId: `${product.id}_${selectedColor?.id || 'no-color'}_${selectedSize?.id || 'no-size'}`
    };
    
    // Simuler un petit délai pour le feedback visuel
    setTimeout(() => {
      // Ajouter le produit au panier avec la quantité spécifiée
      addToCart(productVariant, quantity);
      setLoading(false);
      setAddedToCart(true);
      
      // Réinitialiser le message après 3 secondes
      setTimeout(() => {
        setAddedToCart(false);
      }, 3000);
    }, 500);
  }

  function handleQuantityChange(e) {
    const value = parseInt(e.target.value);
    if (value > 0) {
      setQuantity(value);
    }
  }

  function increaseQuantity() {
    setQuantity(q => q + 1);
  }

  function decreaseQuantity() {
    if (quantity > 1) {
      setQuantity(q => q - 1);
    }
  }

  // Vérifier si le produit est correctement chargé
  if (!product || !product.name) {
    return <div className={styles.loading}>Chargement du produit...</div>;
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className={styles.breadcrumbs}>
        <Link href="/">Accueil</Link> / <span>{product.name}</span>
      </div>
      
      <div className={styles.productContainer}>
        <div className={styles.imageSection}>
          {product.image && product.image.length > 0 ? (
            <div className={styles.mainImage}>
              <Image
                src={`${process.env.NEXT_PUBLIC_STRAPI_API_URL}${product.image[0].url}`}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className={styles.image}
                priority
              />
            </div>
          ) : (
            <div className={styles.noImage}>
              Pas d'image disponible
            </div>
          )}
        </div>
        
        <div className={styles.detailsSection}>
          <h1 className={styles.productName}>{product.name}</h1>
          
          <div className={styles.price}>{product.price} €</div>
          
          <div className={styles.description}>
            <h2>Description</h2>
            <p>{product.description}</p>
          </div>
          
          {/* Sélecteurs de couleur et de taille */}
          <ColorSelector 
            colors={product.colors || []} 
            selectedColor={selectedColor} 
            onChange={setSelectedColor} 
          />
          
          <SizeSelector 
            sizes={product.sizes || []} 
            selectedSize={selectedSize} 
            onChange={setSelectedSize} 
          />
          
          <div className={styles.actions}>
            <div className={styles.quantityControl}>
              <button 
                onClick={decreaseQuantity}
                className={styles.quantityButton}
                aria-label="Diminuer la quantité"
              >
                -
              </button>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={handleQuantityChange}
                className={styles.quantityInput}
                aria-label="Quantité"
              />
              <button 
                onClick={increaseQuantity}
                className={styles.quantityButton}
                aria-label="Augmenter la quantité"
              >
                +
              </button>
            </div>
            
            <button
              onClick={handleAddToCart}
              disabled={loading || 
                (product.colors?.length > 0 && !selectedColor) || 
                (product.sizes?.length > 0 && !selectedSize)}
              className={styles.addToCartButton}
            >
              {loading ? 'Ajout en cours...' : 'Ajouter au panier'}
            </button>
          </div>
          
          {addedToCart && (
            <div className={styles.addedToCartMessage}>
              Produit ajouté au panier !
            </div>
          )}
          
          <div className={styles.shippingInfo}>
            <h3>Détails de livraison</h3>
            <ul>
              <li>Livraison standard: 3-5 jours ouvrés</li>
              <li>Livraison express: 1-2 jours ouvrés</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}