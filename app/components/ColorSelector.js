// app/components/ColorSelector.js
'use client';

import { useState } from 'react';
import styles from './ColorSelector.module.css';

export default function ColorSelector({ colors, selectedColor, onChange }) {
  if (!colors || colors.length === 0) return null;

  return (
    <div className={styles.colorSelector}>
      <span className={styles.label}>Couleur:</span>
      <div className={styles.options}>
        {colors.map((color) => (
          <button
            key={color.id}
            className={`${styles.colorOption} ${selectedColor?.id === color.id ? styles.selected : ''}`}
            style={{ backgroundColor: color.code }}
            onClick={() => onChange(color)}
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
      {selectedColor && (
        <div className={styles.selectedInfo}>
          <span className={styles.colorName}>{selectedColor.name}</span>
        </div>
      )}
    </div>
  );
}