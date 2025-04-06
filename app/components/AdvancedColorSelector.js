// app/components/AdvancedColorSelector.js
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from './AdvancedColorSelector.module.css';

export default function AdvancedColorSelector({ 
  colors, 
  selectedColor, 
  onChange,
  productName,
  colorImages = {} // Objet qui mappe les IDs de couleur aux URLs d'images
}) {
  const [hoveredColor, setHoveredColor] = useState(null);
  const [currentImage, setCurrentImage] = useState(null);
  
  // Mettre à jour l'image quand la couleur sélectionnée change
  useEffect(() => {
    if (selectedColor && colorImages[selectedColor.id]) {
      setCurrentImage(colorImages[selectedColor.id]);
    }
  }, [selectedColor, colorImages]);
  
  if (!colors || colors.length === 0) return null;

  const handleHover = (color) => {
    setHoveredColor(color);
    // Changer temporairement l'image si disponible
    if (colorImages[color.id]) {
      setCurrentImage(colorImages[color.id]);
    }
  };
  
  const handleHoverEnd = () => {
    setHoveredColor(null);
    // Restaurer l'image de la couleur sélectionnée
    if (selectedColor && colorImages[selectedColor.id]) {
      setCurrentImage(colorImages[selectedColor.id]);
    }
  };

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Couleur: {hoveredColor?.name || selectedColor?.name || 'Sélectionnez une couleur'}</h3>
      
      <div className={styles.selectorWrapper}>
        {currentImage && (
          <div className={styles.imagePreview}>
            <Image
              src={currentImage}
              alt={`${productName} - ${hoveredColor?.name || selectedColor?.name}`}
              fill
              sizes="(max-width: 768px) 100vw, 400px"
              className={styles.previewImage}
            />
          </div>
        )}
        
        <div className={styles.colorOptions}>
          {colors.map((color) => (
            <button
              key={color.id}
              className={`${styles.colorOption} ${selectedColor?.id === color.id ? styles.selected : ''}`}
              style={{ 
                backgroundColor: color.code,
                borderColor: color.code === '#FFFFFF' || color.code === '#FFF' ? '#E5E7EB' : 'transparent'
              }}
              onClick={() => onChange(color)}
              onMouseEnter={() => handleHover(color)}
              onMouseLeave={handleHoverEnd}
              title={color.name}
              aria-label={`Couleur ${color.name}`}
              aria-pressed={selectedColor?.id === color.id}
            >
              {selectedColor?.id === color.id && (
                <span className={styles.checkmark}>✓</span>
              )}
            </button>
          ))}
        </div>
      </div>
      
      <div className={styles.colorInfo}>
        <div className={styles.colorChip} style={{ backgroundColor: hoveredColor?.code || selectedColor?.code }}></div>
        <span className={styles.colorName}>{hoveredColor?.name || selectedColor?.name || 'Sélectionnez une couleur'}</span>
      </div>
    </div>
  );
}