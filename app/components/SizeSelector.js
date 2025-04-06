// app/components/SizeSelector.js
'use client';

import styles from './SizeSelector.module.css';

export default function SizeSelector({ sizes, selectedSize, onChange }) {
  if (!sizes || sizes.length === 0) return null;

  return (
    <div className={styles.sizeSelector}>
      <span className={styles.label}>Taille:</span>
      <div className={styles.options}>
        {sizes.map((size) => (
          <button
            key={size.id}
            className={`${styles.sizeOption} ${selectedSize?.id === size.id ? styles.selected : ''}`}
            onClick={() => onChange(size)}
            aria-pressed={selectedSize?.id === size.id}
          >
            {size.name}
          </button>
        ))}
      </div>
    </div>
  );
}