// app/product/[id]/not-found.js
import Link from 'next/link';
import styles from './not-found.module.css';

export default function NotFound() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>Produit non trouvé</h1>
        <p className={styles.message}>
          Désolé, nous n'avons pas trouvé le produit que vous recherchez.
        </p>
        <Link href="/" className={styles.link}>
          Retour à la boutique
        </Link>
      </div>
    </div>
  );
}