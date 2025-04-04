// app/success/page.js
'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useCart } from '../context/CartContext';
import styles from './success.module.css';

export default function Success() {
  const searchParams = useSearchParams();
  const session_id = searchParams.get('session_id');
  const [status, setStatus] = useState('loading');
  const { clearCart } = useCart();

  useEffect(() => {
    if (session_id) {
      // Vider le panier après un achat réussi
      clearCart();
      setStatus('success');
    }
  }, [session_id, clearCart]);

  return (
    <div className={styles.container}>
        <div className={styles.content}>
            {status === 'loading' ? (
            <p>Chargement...</p>
            ) : (
            <>
                <h1 className={styles.title}>Paiement réussi !</h1>
                <p className={styles.message}>
                Merci pour votre achat. Votre commande a été traitée avec succès.
                </p>
                <p>
                    Numero de commande : <strong>{session_id}</strong>
                </p>
                <p>
                    date de commande : <strong>{new Date().toLocaleDateString()}</strong>
                </p>
                <Link href="/" className={styles.link}>
                Retour à la boutique
                </Link>
            </>
            )}
        </div>
        <div className={styles.imageContainer}>
            <img src="/success.png" alt="Success" className={styles.image} />
        </div>
    </div>
    );
}